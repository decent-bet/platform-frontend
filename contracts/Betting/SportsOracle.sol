pragma solidity ^0.4.11;

import '../Token/AbstractDecentBetToken.sol';
import './AbstractBettingProvider.sol';
import '../Libraries/SafeMath.sol';
import '../Libraries/TimeProvider.sol';

contract SportsOracle is SafeMath, TimeProvider {

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
    address[] public authorizedAddresses;

    // Providers who've requested for an oracle's services.
    address[] public requestedProviderAddresses;

    // Accepted providers who can ask the oracle to update game outcomes on their contract.
    address[] public acceptedProviderAddresses;

    // Structs
    struct Provider {
        // Toggled if a provider has requested for acceptance.
        bool requested;
        // Toggled if a provider has been accepted.
        bool accepted;
        bool exists;
    }

    struct Game {
        // Incremented unique id for this game.
        uint id;
        // Reference id set by oracle.
        string refId;
        // Sport id set by oracle. This is meant only for categorization purposes on the front-end.
        uint sportId;
        // League id set by oracle. This is meant only for categorization purposes on the front-end.
        uint leagueId;
        // Starting time for this game.
        uint startTime;
        // Ending time for this game.
        uint endTime;
        // IPFS hash containing meta data.
        string ipfsHash;
        bool exists;
    }

    struct GameUpdate {
        // Game ID in provider contract.
        uint gameId;
        // Toggled when updated.
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
        // Block time at which outcome was published.
        uint settleTime;
        bool exists;
    }

    // Mappings
    mapping (address => bool) public authorized;

    mapping (address => Provider) public providers;

    mapping (uint => Game) public games;

    // List of game periods.
    // Game id => uint[]
    mapping (uint => uint[]) public availableGamePeriods;

    // List of providers who've requested for a game update.
    // Game id => address[]
    mapping (uint => address[]) public gameProvidersUpdateList;

    // Providers who've requested for game update.
    // Game id => (provider address => GameUpdate)
    mapping (uint => mapping(address => GameUpdate)) public providerGamesToUpdate;

    // Period details for games.
    // Game id => (period number => Period)
    mapping (uint => mapping(uint => Period)) public gamePeriods;

    int constant RESULT_TEAM1_WIN = 1;

    int constant RESULT_DRAW = 2;

    int constant RESULT_TEAM2_WIN = 3;

    int constant RESULT_CANCELLED = - 1;

    // Events
    event LogNewAuthorizedAddress(address _address);

    event LogNewAcceptedProvider(address _address);

    event LogGameAdded(uint id, string refId, uint sportId, uint leagueId, string ipfsHash);

    event LogGameDetailsUpdate(uint id, string refId, string ipfsHash);

    event LogGameResult(uint id, string refId, uint period, int result, uint team1Points, uint team2Points);

    event LogUpdatedProviderOutcome(uint id, address provider, uint providerGameId, string refId, uint period, int result,
        uint team1Points, uint team2Points);

    event LogWithdrawal(uint amount);

    event LogNewGameUpdateCost(uint cost);

    event LogNewProviderAcceptanceCost(uint cost);

    // Constructor
    function SportsOracle(address decentBetTokenAddress) {
        owner = msg.sender;
        addAuthorizedAddress(msg.sender);
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);

        // If on local testRPC/testnet and need mock times
        isMock = true;
        setTimeController(msg.sender);
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
        if (result != RESULT_TEAM1_WIN && result != RESULT_DRAW &&
            result != RESULT_TEAM2_WIN && result != RESULT_CANCELLED)
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
        if (games[id].startTime <= getTime())
        throw;
        _;
    }

    // Functions execute only if game has ended.
    modifier hasGameEnded(uint id) {
        if (getTime() <= games[id].endTime)
            throw;
        _;
    }

    // Functions

    // Add a new authorized address.
    function addAuthorizedAddress(address _address)
    onlyOwner {
        if(authorized[_address])
            throw;
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
        LogNewGameUpdateCost(cost);
    }

    // Set a price to accept new providers if it has been toggled on.
    function changeProviderAcceptanceCost(uint cost)
    onlyOwner {
        providerAcceptanceCost = cost;
        LogNewProviderAcceptanceCost(cost);
    }

    // Any provider can request the oracle to accept itself.
    function requestProvider() returns (bool) {
        providers[msg.sender].requested = true;
        providers[msg.sender].exists = true;
        requestedProviderAddresses.push(msg.sender);
        return true;
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
    function payForAcceptance()
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
    function addProviderGameToUpdate(uint gameId, uint providerGameId)
    onlyAcceptedProvider
    isValidGame(gameId)
    hasGameNotStarted(gameId) returns (bool) {
        // Provider should have authorized oracle to spend at least 'gameUpdateCost' in DBETs.
        if (gameUpdateCost > 0 && decentBetToken.allowance(msg.sender, address(this)) < gameUpdateCost) throw;
        providerGamesToUpdate[gameId][msg.sender] = GameUpdate({
            gameId : providerGameId,
            updated : false,
            exists : true
        });
        gameProvidersUpdateList[gameId].push(msg.sender);
        if(gameUpdateCost > 0)
            if (!decentBetToken.transferFrom(msg.sender, address(this), gameUpdateCost)) throw;
        return true;
    }

    // Start time needs to be in advance of the actual game start time.
    function addGame(string refId, uint sportId, uint leagueId, uint startTime,
    uint endTime, uint[] availablePeriods, string ipfsHash)
    onlyAuthorized {
        Game memory game = Game({
            id : gamesCount,
            refId : refId,
            sportId : sportId,
            leagueId : leagueId,
            startTime : startTime,
            endTime : endTime,
            ipfsHash : ipfsHash,
            exists : true
        });
        gamesCount++;
        games[game.id] = game;
        availableGamePeriods[game.id] = availablePeriods;
        for(uint i = 0; i < availablePeriods.length; i++) {
            gamePeriods[game.id][availablePeriods[i]].exists = true;
        }
        LogGameAdded(game.id, refId, sportId, leagueId, ipfsHash);
    }

    // Update swarm hash containing meta-data for the game.
    function updateGameDetails(uint id, string ipfsHash)
    isValidGame(id)
    onlyAuthorized {
        games[id].ipfsHash = ipfsHash;
        LogGameDetailsUpdate(id, games[id].refId, games[id].ipfsHash);
    }

    // Push outcome for a game.
    function pushOutcome(uint gameId, uint period, int result, uint totalPoints, uint team1Points, uint team2Points)
    isValidGame(gameId)
    isValidResult(result)
    hasGameEnded(gameId)
    onlyAuthorized {
        // Period should be valid to continue.
        if (!gamePeriods[gameId][period].exists) throw;
        // Reduce chances of invalid points input.
        if (totalPoints != safeAdd(team1Points, team2Points)) throw;
        gamePeriods[gameId][period] = Period({
            number : period,
            result : result,
            team1Points : team1Points,
            team2Points : team2Points,
            settleTime: getTime(),
            exists: true
        });
        LogGameResult(gameId, games[gameId].refId, period, result, team1Points, team2Points);
    }

    // Update the outcome in a provider contract.
    function updateProviderOutcome(uint gameId, address provider, uint period)
    isValidGame(gameId)
    hasGameEnded(gameId)
    onlyAuthorized {
        if (!providers[provider].accepted) throw;
        // Game period must exist and outcome needs to be published
        if (!gamePeriods[gameId][period].exists || gamePeriods[gameId][period].settleTime == 0) throw;

        AbstractBettingProvider bettingProvider = AbstractBettingProvider(provider);
        providerGamesToUpdate[gameId][provider].updated = true;

        if (!bettingProvider.updateGameOutcome(
            providerGamesToUpdate[gameId][provider].gameId,
            period,
            gamePeriods[gameId][period].result,
            gamePeriods[gameId][period].team1Points,
            gamePeriods[gameId][period].team2Points)) throw;

        LogUpdatedProviderOutcome(gameId,
                                  provider,
                                  providerGamesToUpdate[gameId][provider].gameId,
                                  games[gameId].refId,
                                  period,
                                  gamePeriods[gameId][period].result,
                                  gamePeriods[gameId][period].team1Points,
                                  gamePeriods[gameId][period].team2Points);
    }

    // Allows the owner of the oracle to withdraw DBETs deposited in the contract.
    function withdrawTokens()
    onlyOwner {
        uint amount = decentBetToken.balanceOf(address(this));
        if (!decentBetToken.transfer(msg.sender, amount)) throw;
        LogWithdrawal(amount);
    }

    function getProviderGameId(uint gameId, address provider) constant returns (uint id) {
        return providerGamesToUpdate[gameId][provider].gameId;
    }

    // Don't allow ETH to be sent to this contract.
    function() {
        throw;
    }

}