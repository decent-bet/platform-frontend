pragma solidity ^0.4.11;

contract SportsOracle {

    // Variables
    address public creator;
    uint public gamesCount;
    uint public gameUpdateCost;
    uint public houseAcceptanceCost;
    bool public payForHouseAcceptance;

    // Arrays
    address[] authorizedAddresses;
    address[] requestedHouseAddresses;
    address[] acceptedHouseAddresses;

    // Mappings
    mapping(address => bool) public authorized;
    mapping(address => bool) public requestedHouses;
    mapping(address => bool) public acceptedHouses;
    mapping(uint => Game) public games;

    // Constants
    uint8 constant SPORT_BASEBALL          = 0;
    uint8 constant SPORT_AMERICAN_FOOTBALL = 1;
    uint8 constant SPORT_BASKETBALL        = 2;
    uint8 constant SPORT_TENNIS            = 3;
    uint8 constant SPORT_SOCCER            = 4;
    uint8 constant SPORT_HOCKEY            = 5;

    int8 constant RESULT_WIN       =  1;
    int8 constant RESULT_DRAW      =  2;
    int8 constant RESULT_LOSS      =  3;
    int8 constant RESULT_CANCELLED = -1;

    // Structs
    struct Game {
    uint id;
    string refId;
    uint8 sportId;
    uint startBlock;
    uint endBlock;
    int8 result;
    string ipfsHash;
    mapping(address => uint) houseGamesToUpdate;
    bool exists;
    }

    // Events
    event NewAuthorizedAddress(address _address);
    event NewAcceptedHouse(address _address);
    event GameAdded(uint id, uint8 sportId, string ipfsHash);
    event GameDetailsUpdate(uint id, string ipfsHash);
    event GameResult(uint id, int8 result);

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

    modifier onlyAcceptedHouse() {
        if(!acceptedHouses[msg.sender])
        throw;
        _;
    }

    modifier isPayableForHouseAcceptance() {
        if(!payForHouseAcceptance)
        throw;
        _;
    }

    modifier isValidResult(int8 result) {
        if(result != RESULT_WIN || result != RESULT_DRAW ||
        result != RESULT_LOSS || result != RESULT_CANCELLED)
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
        NewAuthorizedAddress(_address);
    }

    function togglePayForHouseAcceptance(bool enabled)
    onlyOwner {
        payForHouseAcceptance = enabled;
    }

    function changeGameUpdateCost(uint cost)
    onlyOwner {
        gameUpdateCost = cost;
    }

    function changeHouseAcceptanceCost(uint cost)
    onlyOwner {
        houseAcceptanceCost = cost;
    }

    // Any house can request the oracle to accept it
    function requestHouse() {
        requestedHouses[msg.sender] = true;
        requestedHouseAddresses.push(msg.sender);
    }

    // Accepted houses get results pushed into their games at end time
    function acceptHouse(address _address)
    onlyAuthorized {
        acceptedHouses[_address] = true;
        acceptedHouseAddresses.push(_address);
        NewAcceptedHouse(_address);
    }

    // Allows house contracts to pay to be accepted by the oracle
    function payForHouseAcceptance()
    isPayableForHouseAcceptance
    payable {
        if(msg.value < houseAcceptanceCost)
        throw;
        acceptedHouses[msg.sender] = true;
        acceptedHouseAddresses.push(msg.sender);
        NewAcceptedHouse(msg.sender);
    }

    // gameId - ID in oracle contract
    // houseGameId - ID in house contract

    // Oracle should update houseGameId with gameId's result
    function addHouseGameToUpdate(uint gameId, uint houseGameId)
    onlyAcceptedHouse
    isValidGame(gameId)
    hasGameNotStarted(gameId)
    payable {
        if(msg.value < gameUpdateCost)
        throw;
        Game game = games[gameId];
        game.houseGamesToUpdate[msg.sender] = houseGameId;
        games[gameId] = game;
    }

    // Start block needs to be in advance of the actual game start time
    function addGame(string refId, uint8 sportId, uint startBlock, uint endBlock, string ipfsHash)
    onlyAuthorized {
        Game memory game = Game({
        id: gamesCount,
        refId: refId,
        sportId: sportId,
        startBlock: startBlock,
        endBlock: endBlock,
        result: 0,
        ipfsHash: '',
        exists: true
        });
        gamesCount++;
        games[game.id] = game;
        GameAdded(game.id, sportId, ipfsHash);
    }

    function updateGameDetails(uint8 id, string ipfsHash)
    isValidGame(id)
    onlyAuthorized {
        Game game = games[game.id];
        game.ipfsHash = ipfsHash;
        games[game.id] = game;
        GameDetailsUpdate(id, ipfsHash);
    }

    function pushResult(uint id, int8 result)
    isValidGame(id)
    hasGameEnded(id)
    onlyAuthorized {
        Game game = games[game.id];
        game.result = result;
        games[game.id] = game;
        GameResult(id, result);
    }

}