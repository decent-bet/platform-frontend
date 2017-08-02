pragma solidity ^0.4.11;

contract SportsOracle {

    // Variables
    address public creator;
    uint public gamesCount;
    uint public gameUpdateCost;
    uint public providerAcceptanceCost;
    bool public payForProviderAcceptance;

    // Arrays
    address[] authorizedAddresses;
    address[] requestedProviderAddresses;
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
        uint8 sportId;
        uint startBlock;
        uint endBlock;
        int8 result;
        string swarmHash;
        mapping(address => string) providerGamesToUpdate;
        address[] providersToUpdate;
        bool exists;
    }

    struct Period {
        uint8 number;
        uint team1Score;
        uint team2Score;
        uint settleTime;
    }

    // Mappings
    mapping(address => bool) public authorized;
    mapping(address => Provider) public providers;
    mapping(uint => Game) public games;

    // Constants
    uint8 constant SPORT_BASEBALL          = 0;
    uint8 constant SPORT_AMERICAN_FOOTBALL = 1;
    uint8 constant SPORT_BASKETBALL        = 2;
    uint8 constant SPORT_TENNIS            = 3;
    uint8 constant SPORT_SOCCER            = 4;
    uint8 constant SPORT_HOCKEY            = 5;

    int8 constant RESULT_TEAM1_WIN         = 1;
    int8 constant RESULT_DRAW              = 2;
    int8 constant RESULT_TEAM2_WIN         = 3;
    int8 constant RESULT_CANCELLED         = -1;

    // Events
    event LogNewAuthorizedAddress(address _address);
    event LogNewAcceptedProvider(address _address);
    event LogGameAdded(uint id, string refId, uint8 sportId, string swarmHash);
    event LogGameDetailsUpdate(uint id, string refId, string swarmHash);
    event LogGameResult(uint id, string refId, int8 result);

    // Constructor
    function SportsOracle() {
        creator = msg.sender;
        authorized[msg.sender] = true;
    }

    // Modifiers
    modifier onlyOwner() {
        if(msg.sender != creator)
        throw;
        _;
    }

    modifier onlyAuthorized() {
        if(!authorized[msg.sender])
        throw;
        _;
    }

    modifier onlyAcceptedProvider() {
        if(!providers[msg.sender].accepted)
        throw;
        _;
    }

    modifier isPayableForProviderAcceptance() {
        if(!payForProviderAcceptance)
        throw;
        _;
    }

    modifier isValidResult(int8 result) {
        if(result != RESULT_TEAM1_WIN || result != RESULT_DRAW ||
        result != RESULT_TEAM2_WIN || result != RESULT_CANCELLED)
        throw;
        _;
    }

    modifier isValidGame(uint id) {
        if(!games[id].exists)
        throw;
        _;
    }

    modifier hasGameNotStarted(uint id) {
        if(games[id].startBlock <= block.number)
        throw;
        _;
    }

    modifier hasGameEnded(uint id) {
        if(block.number <= games[id].endBlock)
        throw;
        _;
    }

    // Functions
    function addAuthorized(address _address)
    onlyOwner {
        authorized[_address] = true;
        authorizedAddresses.push(_address);
        LogNewAuthorizedAddress(_address);
    }

    function togglePayForProviderAcceptance(bool enabled)
    onlyOwner {
        payForProviderAcceptance = enabled;
    }

    function changeGameUpdateCost(uint cost)
    onlyOwner {
        gameUpdateCost = cost;
    }

    function changeProviderAcceptanceCost(uint cost)
    onlyOwner {
        providerAcceptanceCost = cost;
    }

    // Any provider can request the oracle to accept it
    function requestProvider() {
        providers[msg.sender].requested = true;
        providers[msg.sender].exists = true;
        requestedProviderAddresses.push(msg.sender);
    }

    // Accepted houses get results pushed into their games at end time
    function acceptProvider(address _address)
    onlyAuthorized {
        providers[_address].accepted = true;
        acceptedProviderAddresses.push(_address);
        LogNewAcceptedProvider(_address);
    }

    // Allows house contracts to pay to be accepted by the oracle
    function payForProviderAcceptance()
    isPayableForProviderAcceptance
    payable {
        if(msg.value < providerAcceptanceCost)
        throw;
        providers[msg.sender].accepted = true;
        providers[msg.sender].exists = true;
        acceptedProviderAddresses.push(msg.sender);
        LogNewAcceptedProvider(msg.sender);
    }

    // gameId - ID in oracle contract
    // houseGameId - ID in house contract

    // Reference for oracle to update betting provider under house with gameId's result
    function addProviderGameToUpdate(uint gameId, string providerGameId)
    onlyAcceptedProvider
    isValidGame(gameId)
    hasGameNotStarted(gameId)
    payable {
        if(msg.value < gameUpdateCost) throw;
        Game game = games[gameId];
        game.providerGamesToUpdate[msg.sender] = providerGameId;
        game.providersToUpdate.push(msg.sender);
        games[gameId] = game;
    }

    // Start block needs to be in advance of the actual game start time
    function addGame(string refId, uint8 sportId, uint startBlock,
    uint endBlock, string swarmHash)
    onlyAuthorized {
        Game memory game = Game({
        id: gamesCount,
        refId: refId,
        sportId: sportId,
        startBlock: startBlock,
        endBlock: endBlock,
        result: 0,
        swarmHash: '',
        providersToUpdate: new address[](0),
    exists: true
    });
        gamesCount++;
        games[game.id] = game;
        LogGameAdded(game.id, refId, sportId, swarmHash);
    }

    // Update IPFS hash containing meta-data for the game
    function updateGameDetails(uint8 id, string swarmHash)
    isValidGame(id)
    onlyAuthorized {
        games[id].swarmHash = swarmHash;
        LogGameDetailsUpdate(id, games[id].refId, games[id].swarmHash);
    }

    // Push result for a game
    function pushResult(uint id, int8 result)
    isValidGame(id)
    isValidResult(result)
    hasGameEnded(id)
    onlyAuthorized {
        games[id].result = result;
        LogGameResult(id, games[id].refId, result);
    }

}