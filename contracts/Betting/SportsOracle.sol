pragma solidity ^0.4.11;

import '../Token/AbstractDecentBetToken.sol';
import './AbstractBettingProvider.sol';
import '../Libraries/SafeMath.sol';

contract SportsOracle is SafeMath {

    //Contracts
    AbstractDecentBetToken decentBetToken;

    // Variables

    // Contract owner.
    address public owner;

    // Number of games pushed out by oracle.
    uint public gamesCount;

    // Cost of updating a game for a provider.
    uint public gameUpdateCost;

    // Cost of accepting a new provider, if 'payForProviderAcceptance' is enabled.
    uint public providerAcceptanceCost;

    // Allows oracle to accept payments to add providers to it's accepted addresses.
    bool public payForProviderAcceptance;

    // Arrays

    // Authorized addresses.
    address[] authorizedAddresses;

    // Providers who've requested for an oracle's services.
    address[] requestedProviderAddresses;

    // Accepted providers who can ask the oracle to update game outcomes on their contract.
    address[] acceptedProviderAddresses;

    // Structs
    struct Provider {
        bool requested;
        bool accepted;
        bool exists;
    }

    struct Game {
        uint id;
        string refId;
        uint sportId;
        uint startBlock;
        uint endBlock;
        string swarmHash;
        mapping (address => GameUpdate) providerGamesToUpdate;
        mapping (uint => Period) periods;
        uint[] availablePeriods;
        address[] providersToUpdate;
        bool exists;
    }

    struct GameUpdate {
        string gameId;
        bool updated;
        bool exists;
    }

    struct Period {
        // Period Number.
        uint number;
        // Either Team1, Team2, Draw, Cancelled.
        int result;
        // Team 1 Points in game.
        uint team1Points;
        // Team 2 Points in game.
        uint team2Points;
        // Block at which outcome was published.
        uint settleBlock;
        bool exists;
    }

    // Mappings
    mapping (address => bool) public authorized;

    mapping (address => Provider) public providers;

    mapping (uint => Game) public games;

    int constant RESULT_TEAM1_WIN = 1;

    int constant RESULT_DRAW = 2;

    int constant RESULT_TEAM2_WIN = 3;

    int constant RESULT_CANCELLED = - 1;

    // Events
    event LogNewAuthorizedAddress(address _address);

    event LogNewAcceptedProvider(address _address);

    event LogGameAdded(uint id, string refId, uint sportId, string swarmHash);

    event LogGameDetailsUpdate(uint id, string refId, string swarmHash);

    event LogGameResult(uint id, string refId, uint period, int result, uint team1Points, uint team2Points);

    event LogUpdatedProviderOutcome(uint id, address provider, string refId, uint period, int result,
        uint team1Points, uint team2Points);

    event LogWithdrawal(uint amount);

    // Constructor
    function SportsOracle(address decentBetTokenAddress) {
        owner = msg.sender;
        authorized[msg.sender] = true;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
    }

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner)
        throw;
        _;
    }

    modifier onlyAuthorized() {
        if (!authorized[msg.sender])
        throw;
        _;
    }

    // Allow only accepted providers to call this function.
    modifier onlyAcceptedProvider() {
        if (!providers[msg.sender].accepted)
        throw;
        _;
    }

    // If oracles allow payments for new providers to use them, allow the function to continue.
    modifier isPayableForProviderAcceptance() {
        if (!payForProviderAcceptance)
        throw;
        _;
    }

    // Allow only valid results to be passed through to a function.
    modifier isValidResult(int result) {
        if (result != RESULT_TEAM1_WIN || result != RESULT_DRAW ||
        result != RESULT_TEAM2_WIN || result != RESULT_CANCELLED)
        throw;
        _;
    }

    // Functions execute only if game exists.
    modifier isValidGame(uint id) {
        if (!games[id].exists)
        throw;
        _;
    }

    // Functions execute only if game hasn't started.
    modifier hasGameNotStarted(uint id) {
        if (games[id].startBlock <= block.number)
        throw;
        _;
    }

    // Functions execute only if game has ended.
    modifier hasGameEnded(uint id) {
        if (block.number <= games[id].endBlock)
        throw;
        _;
    }

    // Functions

    // Add a new authorized address.
    function addAuthorized(address _address)
    onlyOwner {
        authorized[_address] = true;
        authorizedAddresses.push(_address);
        LogNewAuthorizedAddress(_address);
    }

    // Allow oracle to accept new providers via payment.
    function togglePayForProviderAcceptance(bool enabled)
    onlyOwner {
        payForProviderAcceptance = enabled;
    }

    // Set a price for game updates to be pushed to providers.
    function changeGameUpdateCost(uint cost)
    onlyOwner {
        gameUpdateCost = cost;
    }

    // Set a price to accept new providers if it has been toggled on.
    function changeProviderAcceptanceCost(uint cost)
    onlyOwner {
        providerAcceptanceCost = cost;
    }

    // Any provider can request the oracle to accept itself.
    function requestProvider() {
        providers[msg.sender].requested = true;
        providers[msg.sender].exists = true;
        requestedProviderAddresses.push(msg.sender);
    }

    // Accepted providers get results pushed into their games at end time.
    function acceptProvider(address _address)
    onlyAuthorized {
        providers[_address].accepted = true;
        acceptedProviderAddresses.push(_address);
        LogNewAcceptedProvider(_address);
    }

    // Allows providers to pay to be accepted by the oracle.
    // Providers need to authorize oracles for the acceptance cost before calling this function.
    function payForProviderAcceptance()
    isPayableForProviderAcceptance {
        // Provider should have authorized oracle to spend at least 'providerAcceptanceCost' in DBETs.
        if (decentBetToken.allowance(msg.sender, address(this)) < providerAcceptanceCost) throw;
        providers[msg.sender].accepted = true;
        providers[msg.sender].exists = true;
        acceptedProviderAddresses.push(msg.sender);
        if (!decentBetToken.transferFrom(msg.sender, address(this), providerAcceptanceCost)) throw;
        LogNewAcceptedProvider(msg.sender);
    }

    // gameId - ID in oracle contract
    // providerGameId - ID in provider contract
    // Reference for oracle to update betting provider with gameId's result
    function addProviderGameToUpdate(uint gameId, string providerGameId)
    onlyAcceptedProvider
    isValidGame(gameId)
    hasGameNotStarted(gameId) returns (bool) {
        // Provider should have authorized oracle to spend at least 'gameUpdateCost' in DBETs.
        if (decentBetToken.allowance(msg.sender, address(this)) < gameUpdateCost) throw;
        games[gameId].providerGamesToUpdate[msg.sender] = GameUpdate({
            gameId : providerGameId,
            updated : false,
            exists : true
        });
        games[gameId].providersToUpdate.push(msg.sender);
        if (!decentBetToken.transferFrom(msg.sender, address(this), gameUpdateCost)) throw;
        return true;
    }

    // Start block needs to be in advance of the actual game start time.
    function addGame(string refId, uint sportId, uint startBlock,
    uint endBlock, uint[] availablePeriods, string swarmHash)
    onlyAuthorized {
        Game memory game = Game({
            id : gamesCount,
            refId : refId,
            sportId : sportId,
            startBlock : startBlock,
            endBlock : endBlock,
            swarmHash : '',
            providersToUpdate : new address[](0),
            availablePeriods: availablePeriods,
            exists : true
        });
        gamesCount++;
        games[game.id] = game;
        LogGameAdded(game.id, refId, sportId, swarmHash);
    }

    // Update IPFS hash containing meta-data for the game.
    function updateGameDetails(uint id, string swarmHash)
    isValidGame(id)
    onlyAuthorized {
        games[id].swarmHash = swarmHash;
        LogGameDetailsUpdate(id, games[id].refId, games[id].swarmHash);
    }

    // Push outcome for a game.
    function pushOutcome(uint gameId, uint period, int result, uint totalPoints, uint team1Points, uint team2Points)
    isValidGame(gameId)
    isValidResult(result)
    hasGameEnded(gameId)
    onlyAuthorized {
        // Period should be valid to continue.
        if (!games[gameId].periods[period].exists) throw;
        // Reduce chances of invalid points input.
        if (totalPoints != safeAdd(team1Points, team2Points)) throw;
            games[gameId].periods[period] = Period({
            number : period,
            result : result,
            team1Points : team1Points,
            team2Points : team2Points,
            settleBlock: block.number,
            exists: true
        });
        LogGameResult(gameId, games[gameId].refId, period, result, team1Points, team2Points);
    }

    // Update the outcome in a provider contract.
    function updateProviderOutcome(uint gameId, address provider, uint period, int result,
    uint team1Points, uint team2Points)
    isValidGame(gameId)
    isValidResult(result)
    hasGameEnded(gameId)
    onlyAuthorized {
        if (!providers[provider].accepted) throw;
        AbstractBettingProvider bettingProvider = AbstractBettingProvider(provider);
        games[gameId].providerGamesToUpdate[msg.sender].updated = true;
        if (!bettingProvider.updateGameOutcome(games[gameId].providerGamesToUpdate[msg.sender].gameId,
            period, result, team1Points, team2Points)) throw;
        LogUpdatedProviderOutcome(gameId, provider, games[gameId].refId, period, result, team1Points, team2Points);
    }

    // Allows the owner of the oracle to withdraw DBETs deposited in the contract
    function withdrawTokens()
    onlyOwner {
        uint amount = decentBetToken.balanceOf(address(this));
        if (!decentBetToken.transfer(msg.sender, amount)) throw;
        LogWithdrawal(amount);
    }

    // Don't allow ETH to be sent to this contract.
    function() {
        throw;
    }

}