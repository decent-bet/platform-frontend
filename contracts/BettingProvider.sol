pragma solidity ^0.4.8;


import './AbstractDecentBetToken.sol';
import './AbstractHouse.sol';
import './SafeMath.sol';


contract BettingProvider is SafeMath {

	// Contracts
	AbstractDecentBetToken decentBetToken;

	AbstractHouse house;

	// Structs
	struct Odds {
		// Incremented ID for each game.
		uint id;
		// Odds for win
		uint win;
		// Odds for draw
		uint draw;
		// Odds for loss
		uint loss;
	}

	struct Game {
		string id;
		// Id of game under oracle
		uint oracleId;
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
		// End of betting time. Typically a short time period before start of the game.
		uint cutOffTime;
		// Ending game time. Claim after endTime + RESULT_OFFSET_HOURS hours.
		uint endTime;
		// Games may go over the posted endTime. Once it has ended, this is toggle to true.
		bool hasEnded;
		// 1 - Win, 2 - Draw, 3 - Loss, -1 - Cancelled
		int outcome;
		// Toggled to true if valid game.
		bool exists;
	}

	struct Bet {
		uint id;
		// Game ID.
		string gameId;
		// Odds at which bet was placed.
		Odds odds;
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
		bool exists;
	}

	// Arrays
	string[] public availableGames;

	// Mappings
	mapping (string => Game) games;
	// Bets placed by users.
	// userAddress => (gameId => Bet).
	mapping (address => mapping (string => UserBets)) userBets;
	// Address of users who've bet on a game.
	// gameId => userAddress[].
	mapping (string => address[]) gameBettors;

	// Variables
	address houseAddress;

	uint constant public RESULT_OFFSET_HOURS = 24;

	int8 constant RESULT_WIN = 1;

	int8 constant RESULT_DRAW = 2;

	int8 constant RESULT_LOSS = 3;

	int8 constant RESULT_CANCELLED = - 1;

	// Events
	event LogNewGame(string id, uint oracleId, uint winOdds, uint drawOdds,
		uint lossOdds, uint cutOffTime, uint endTime);

	event LogUpdatedGameOdds(string id, uint winOdds, uint drawOdds,
		uint lossOdds);

	event LogNewBet(string gameId, uint id, address bettor, int choice,
		uint odds, uint amount);

	event LogClaimedBet(string gameId, uint id, address bettor, uint amount,
		uint payout);

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
		if (now >= (games[id].cutOffTime - 15 minutes)) throw;
		_;
	}

	// Allows functions to execute only if the game hasn't started yet.
	modifier isGameBettable(string id) {
		if (now >= games[id].cutOffTime) throw;
		_;
	}

	// Allows functions to execute only if a game is past end time.
	modifier isPastGameEndTime(string id) {
		if (now < games[id].endTime) throw;
		_;
	}

	// Allows functions to execute only if a game is past end time and is marked as ended.
	modifier isGameProfitsClaimable(string id) {
		if (now < games[id].endTime + RESULT_OFFSET_HOURS || !games[id].hasEnded) throw;
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

	modifier isUnclaimedBet(string gameId, uint betId) {
		if (userBets[msg.sender][gameId].bets[betId].claimed) throw;
		_;
	}

	// Adds a game to the contract.
	function addGame(string id, uint oracleId, int[] parties, uint winOdds,
	uint drawOdds, uint lossOdds, uint maxBet,
	uint cutOffTime, uint endTime)
	onlyAuthorized {
		Odds memory odds = Odds({
			id : 1,
			win : winOdds,
			draw : drawOdds,
			loss : lossOdds
		});
		Game memory game = Game({
			id : id,
			oracleId : oracleId,
			odds : odds,
			previousOdds : Odds(0, 0, 0, 0),
			oddsUpdateTime : 0,
			oddsUpdateCount : 0,
			betCount : 0,
			maxBet : maxBet,
			cutOffTime : cutOffTime,
			endTime : endTime,
			hasEnded : false,
			outcome : 0,
			exists : true
		});
		games[id] = game;
		availableGames.push(id);
	}

	// Updates odds for a game. Until a timeout of say 300 seconds, has passed,
	// previous odds would still be active, till new odds are enforced.
	function updateGameOdds(string id, uint winOdds, uint drawOdds, uint lossOdds)
	onlyAuthorized
	isValidGame(id)
	isGameOddsUpdatable(id)
	returns (bool updated) {
		Game game = games[id];
		game.previousOdds = game.odds;
		game.odds = Odds(game.odds.id + 1, winOdds, drawOdds, lossOdds);
		game.oddsUpdateTime = now;
		game.oddsUpdateCount += 1;
		games[id] = game;
		LogUpdatedGameOdds(id, winOdds, drawOdds, lossOdds);
	}

	// Updates the outcome of a game.
	function updateGameOutcome(string id, int8 outcome)
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

	function getChoiceOdds(string gameId, int choice) internal returns (uint) {
		if (choice == RESULT_WIN)
		return games[gameId].odds.win;
		else if (choice == RESULT_DRAW)
		return games[gameId].odds.draw;
		if (choice == RESULT_LOSS)
		return games[gameId].odds.loss;
	}

	function getChoiceOdds(Bet bet) internal returns (uint) {
		if (bet.choice == RESULT_WIN)
		return bet.odds.win;
		else if (bet.choice == RESULT_DRAW)
		return bet.odds.draw;
		if (bet.choice == RESULT_LOSS)
		return bet.odds.loss;
	}

	// Bet on a game.
	function bet(string gameId, uint odds, int choice, uint amount)
	isTokensAvailable(amount)
	isValidGame(gameId)
	isGameBettable(gameId)
	returns (bool betPlaced) {
		Game game = games[gameId];
		uint choiceOdds = getChoiceOdds(gameId, choice);

		// Odds sent in function call were different from that on contract.
		// Don't allow function call to continue.
		if (odds != choiceOdds) throw;

		game.betAmounts[choice] += amount;
		game.betCount += 1;

		Bet memory bet = Bet({
			id : game.betCount,
			gameId : gameId,
			odds : game.odds,
			choice : choice,
			amount : amount,
			timestamp : now,
			exists : true,
			claimed : false
		});

		userBets[msg.sender][gameId].betIds.push(game.betCount);
		userBets[msg.sender][gameId].bets[game.betCount] = bet;
		gameBettors[gameId].push(msg.sender);

		if (!decentBetToken.transfer(houseAddress, amount)) throw;
		LogNewBet(gameId, bet.id, msg.sender, choice, choiceOdds, amount);
	}

	// Claims the winnings for a bet.
	function claimBet(string gameId, uint betId)
	isValidGame(gameId)
	isGameProfitsClaimable(gameId)
	isWinningBet(gameId, betId)
	isUnclaimedBet(gameId, betId) {
		Bet bet = userBets[msg.sender][gameId].bets[betId];
		uint amount = bet.amount;
		uint odds = getChoiceOdds(bet);
		uint payout = safeAdd(amount, safeMul(amount, odds));
		bet.claimed = true;
		userBets[msg.sender][gameId].bets[betId] = bet;
		if (!house.transferWinnings(msg.sender, payout)) throw;
		LogClaimedBet(gameId, betId, msg.sender, amount,
		payout);
	}

	// Don't allow ETH to be sent to this contract
	function() {
		throw;
	}

}
