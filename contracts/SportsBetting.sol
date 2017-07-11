pragma solidity ^0.4.8;


import './AbstractDecentBetToken.sol';
import './AbstractHouse.sol';
import './SafeMath.sol';


contract SportsBetting is SafeMath {

    // Contracts
    AbstractDecentBetToken decentBetToken;

    AbstractHouse house;

    // Structs
    struct Odds {
        // Incremented ID for each game.
        uint id;
        // Number of parties. Would be 2 for soccer, MMA, boxing, NFL, NHL.
        // For horse racing, racing etc. it would be more.
        uint parties;
        // PartyNumber => odds
        // -1 = Draw. 0 = No result, 1..n = Winner.
        mapping (int => uint) partyOdds;
    }

    struct Game {
        string id;
        // Odds for this game.
        Odds odds;
        // Odds before update.
        Odds previousOdds;
        // Previous odds updated time.
        uint oddsUpdateTime;
        // Previous of odd updates.
        uint oddsUpdateCount;
        // Mapping of party => bet amounts.
        mapping (int => uint) betAmounts;
        // Number of bets.
        uint betCount;
        // Bet limit for this game.
        uint maxBet;
        // Starting game time. Bet up till startTime.
        uint startTime;
        // Ending game time. Claim after endTime.
        uint endTime;
        // Games may go over the posted endTime. Once it has ended, this is toggle to true.
        bool hasEnded;
        // -1 = Draw. 0 = No result, 1..n = Winner.
        int outcome;
        // Toggled to true if valid game.
        bool exists;
    }

    struct Bet {
        uint id;
        // Game ID.
        string gameId;
        // Odds at which bet was placed.
        uint odds;
        // Outcome of choice selected by user.
        int choice;
        // Amount of tokens bet.
        uint amount;
        // Time of bet.
        uint timestamp;
        // Toggled to true if valid bet.
        bool exists;
        // Toggled if claimed.
        bool claimed;
    }

    struct UserBets {
        // Array of bet IDs.
        uint[] betIds;
        // Mapping of bets.
        mapping (uint => Bet) bets;
    }

    // Mappings
    mapping (string => Game) games;

    string[] public availableGames;

    // Bets placed by users.
    // userAddress => (gameId => Bet).
    mapping (address => mapping (string => UserBets)) userBets;

    // Address of users who've bet on a game.
    // gameId => userAddress[].
    mapping (string => address[]) gameBettors;

    // Variables
    address houseAddress;

    // Constructor.
    function SportsBetting(address decentBetTokenAddress, address _houseAddress) {
        if (decentBetTokenAddress == 0) throw;
        if (_houseAddress == 0) throw;
        houseAddress = _houseAddress;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
        house = AbstractHouse(houseAddress);
    }

    // Modifiers.
    modifier onlyAuthorized() {
        if (house.authorized(msg.sender) == false) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" tokens in their balance.
    modifier isTokensAvailable(uint amount) {
        if (decentBetToken.balanceOf(msg.sender) < amount) throw;
        _;
    }

    // Allows functions to execute only if game exists.
    modifier isValidGame(string id) {
        if (games[id].exists == false) throw;
        _;
    }

    // Allows functions to execute only if time is less than 15 minutes before the game's startTime.
    modifier isGameOddsUpdatable(string id) {
        if (now >= (games[id].startTime - 15 minutes)) throw;
        _;
    }

    // Allows functions to execute only if the game hasn't started yet.
    modifier isGameBettable(string id) {
        if (now >= games[id].startTime) throw;
        _;
    }

    // Allows functions to execute only if a game is past end time.
    modifier isPastGameEndTime(string id) {
        if (now < games[id].endTime) throw;
        _;
    }

    // Allows functions to execute only if a game is past end time and is marked as ended.
    modifier hasGameEnded(string id) {
        if (now < games[id].endTime || !games[id].hasEnded) throw;
        _;
    }

    // Allows functions to execute only if a bet has been placed.
    modifier isValidBet(string gameId, uint betId) {
        if (userBets[msg.sender][gameId].bets[betId].exists == false) throw;
        _;
    }

    // Allows functions to execute only if a bet is a winning bet.
    modifier isWinningBet(string gameId, uint betId) {
        if (games[gameId].outcome != userBets[msg.sender][gameId].bets[betId].choice &&
        games[gameId].outcome != - 1) throw;
        _;
    }

    // Adds a game to the contract.
    function addGame(string id, int[] parties, uint[] partyOdds, uint maxBet, uint startTime, uint endTime)
    onlyAuthorized
    returns (bool added){
        Odds memory odds = Odds({
            id : 1,
            parties : parties.length
        });
        Game memory game = Game({
            id : id,
            odds : odds,
            previousOdds : Odds(0, 0),
            oddsUpdateTime : 0,
            oddsUpdateCount : 0,
            betCount : 0,
            maxBet : maxBet,
            startTime : startTime,
            endTime : endTime,
            hasEnded : false,
            outcome : 0,
            exists : true
        });
        games[id] = game;
        for (uint i = 0; i < parties.length; i++){
            games[id].odds.partyOdds[parties[i]] = partyOdds[i];
        }
        availableGames.push(id);
        return true;
    }

    // Updates odds for a game. Until a timeout of say 300 seconds, has passed,
    // previous odds would still be active, till new odds are enforced.
    function updateGameOdds(string id, int[] parties, uint[] partyOdds)
    onlyAuthorized
    isValidGame(id)
    isGameOddsUpdatable(id)
    returns (bool updated) {
        Game game = games[id];
        game.previousOdds = game.odds;
        game.odds = Odds(game.odds.id + 1, parties.length);
        game.oddsUpdateTime = now;
        game.oddsUpdateCount += 1;
        games[id] = game;
        for (uint i = 0; i < parties.length; i++)
        games[id].odds.partyOdds[parties[i]] = partyOdds[i];
        return true;
    }

    // Updates the outcome of a game.
    function updateGameOutcome(string id, uint8 outcome)
    onlyAuthorized
    isValidGame(id)
    isPastGameEndTime(id)
    returns (bool updated) {
        Game game = games[id];
        game.outcome = outcome;
        game.hasEnded = true;
        games[id] = game;
        return true;
    }

    // Bet on a game.
    function bet(string gameId, uint odds, int choice, uint amount)
    isTokensAvailable(amount)
    isValidGame(gameId)
    isGameBettable(gameId)
    returns (bool betPlaced) {
        Game game = games[gameId];
        uint choiceOdds = game.odds.partyOdds[choice];
        // Odds sent in function call were different from that on contract.
        // Don't allow function call to continue.
        if (odds != choiceOdds) throw;
        if (!decentBetToken.transfer(houseAddress, amount)) throw;
        game.betAmounts[choice] += amount;
        game.betCount += 1;
        Bet memory bet = Bet({
            id : game.betCount,
            gameId : gameId,
            odds : odds,
            choice : choice,
            amount : amount,
            timestamp : now,
            exists : true,
            claimed : false
        });
        userBets[msg.sender][gameId].betIds.push(game.betCount);
        userBets[msg.sender][gameId].bets[game.betCount] = bet;
        gameBettors[gameId].push(msg.sender);
        return true;
    }

    // Claims the winnings for a bet.
    function claimBet(string gameId, uint betId)
    isValidGame(gameId)
    hasGameEnded(gameId)
    isValidBet(gameId, betId)
    isWinningBet(gameId, betId)
    returns (bool claimed) {
        Game game = games[gameId];
        Bet bet = userBets[msg.sender][gameId].bets[betId];
        uint amount = bet.amount;
        uint odds = bet.odds;
        uint winnings = safeMul(amount, odds);
        bet.claimed = true;
        userBets[msg.sender][gameId].bets[betId] = bet;
        if (!house.transferWinnings(msg.sender, winnings)) throw;
        return true;
    }

    // Don't allow ETH to be sent to this contract
    function() {
        throw;
    }

}
