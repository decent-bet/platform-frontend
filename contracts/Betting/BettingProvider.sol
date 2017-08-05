pragma solidity ^0.4.8;


import '../Token/AbstractDecentBetToken.sol';
import '../House/AbstractHouse.sol';
import './AbstractBettingProviderHelper.sol';
import './AbstractSportsOracle.sol';
import '../Libraries/SafeMath.sol';
import '../House/HouseOffering.sol';

contract BettingProvider is SafeMath, HouseOffering {

    // Contracts
    AbstractBettingProviderHelper bettingProviderHelper;

    AbstractDecentBetToken decentBetToken;

    AbstractSportsOracle sportsOracle;

    AbstractHouse house;

    // Structs
    struct GameOdds {
        // Mapping of odds for this game.
        mapping(uint => Odds) odds;
        // IDs of odds for this game.
        uint[] ids;
        // Number of odds available.
        uint oddsCount;
    }

    struct Odds {
        // Type of odds. 1 - Spread, 2 - Moneyline, 3 - Total, 4 - Team Total
        uint betType;
        // Reference ID for odds.
        string refId;
        // Period in game.
        uint period;
        // Handicap multiplied by 100. A handicap of 0.25 would equate to 25. Used in spread.
        int handicap;
        // Team 1 odds - Used in spread, moneyline.
        int team1;
        // Team 2 odds - Used in spread, moneyline.
        int team2;
        // Draw odds - Used in spread, moneyline.
        int draw;
        // Points multiplied by 100. 14.5 points would equate to 1450. Used in totals/team totals.
        uint points;
        // Over odds. Used in totals/team totals.
        int over;
        // Under odds. Used in totals/team totals.
        int under;
        // false if team2. Used in team totals.
        bool isTeam1;
        // Betting provider can activate/de-activate these odds when necessary.
        bool isActive;
        // Previous odds updated block.
        uint updateBlock;
        // Does odds exist in mapping
        bool exists;
    }

    struct Outcome {
        // Either Team1, Team2, Draw, Cancelled.
        int result;
        // Total Points in game.
        uint totalPoints;
        // Team 1 Points in game.
        uint team1Points;
        // Team 2 Points in game.
        uint team2Points;
        // Have outcomes been published?
        bool isPublished;
        // Block settle time.
        uint settleBlock;
    }

    struct Game {
        // Id of game under oracle
        uint oracleGameId;
        // Session for this game.
        uint session;
        // Odds for this game.
        GameOdds odds;
        // Mapping of address => bettor.
        mapping (address => Bettor) bettors;
        // Array of bettors.
        address[] bettorsList;
        // Amount in bets.
        uint betAmount;
        // Payouts.
        uint payouts;
        // Number of bets.
        uint betCount;
        // Bet limits for this game.
        uint[4] betLimits;
        // End of betting time. Typically a short time period before start of the game.
        uint cutOffBlock;
        // Ending game block. Claim after endBlock + RESULT_OFFSET_HOURS hours.
        uint endBlock;
        // Games may go over the posted ending block. Once it has ended, this is toggled to true.
        bool hasEnded;
        // Outcome of game period.
        mapping(uint => Outcome) outcomes;
        // Toggled to true if valid game.
        bool exists;
    }

    struct Bettor {
        // Bet count.
        uint betCount;
        // Bet linked to incremented id
        mapping (uint => Bet) bets;
    }

    struct Bet {
        // Incremented bet id.
        uint id;
        // Odds at which bet was placed.
        uint oddsId;
        // Odds at time of bet.
        Odds odds;
        // Bet choice.
        uint choice;
        // Amount of tokens bet.
        uint amount;
        // Block number at time of bet.
        uint blockNumber;
        // Session during which bet was placed.
        uint session;
        // Toggled if claimed.
        bool claimed;
        // Toggled to true if valid bet.
        bool exists;
    }

    struct UserBets {
        // Array of bet IDs.
        string[] gameIds;
        bool exists;
    }

    struct SessionStats {
        uint totalBetAmount;
        uint totalPayout;
        uint totalDeposited;
        uint totalProfit;
        bool withdrawn;
        bool exists;
    }

    // Arrays
    string[] public availableGames;

    // Mappings
    mapping (string => Game) games;

    // Bets placed by users.
    // userAddress => (gameId => Bet).
    mapping (address => UserBets) userBets;

    // Users need to deposit/withdraw tokens for a sessionwith the provider before placing bets.
    // These can be withdrawn at any time.
    // mapping (userAddress => mapping (sessionNumber => amount))
    mapping (address => mapping (uint => uint)) depositedTokens;

    // Stats for the ongoing session.
    mapping (uint => SessionStats) sessionStats;

    // Variables
    address houseAddress;

    address sportsOracleAddress;

    uint currentSession;

    // Result constants.
    uint constant public RESULT_OFFSET_HOURS = 24;

    int constant RESULT_TEAM1_WIN          = 1;

    int constant RESULT_DRAW               = 2;

    int constant RESULT_TEAM2_WIN          = 3;

    int constant RESULT_CANCELLED          = -1;

    // Odds Type constants.
    uint constant ODDS_TYPE_SPREAD         = 1;

    uint constant ODDS_TYPE_MONEYLINE      = 2;

    uint constant ODDS_TYPE_TOTAL          = 3;

    uint constant ODDS_TYPE_TEAM_TOTAL     = 4;

    // Bet choice constants.
    uint constant BET_CHOICE_TEAM1         = 1;

    uint constant BET_CHOICE_DRAW          = 2;

    uint constant BET_CHOICE_TEAM2         = 3;

    uint constant BET_CHOICE_OVER          = 4;

    uint constant BET_CHOICE_UNDER         = 5;

    // Spread outcome constants.
    uint constant SPREAD_OUTCOME_WIN       = 1;

    uint constant SPREAD_OUTCOME_DRAW      = 2;

    uint constant SPREAD_OUTCOME_LOSS      = 3;

    uint constant SPREAD_OUTCOME_HALF_WIN  = 4;

    uint constant SPREAD_OUTCOME_HALF_LOSS = 5;

    // Assisted claim offset blocks constants.
    uint ASSISTED_CLAIM_BLOCK_OFFSET       = 8640;

    // Events
    event LogNewGame(string id, uint oracleId, uint cutOffBlock, uint endBlock);

    event LogNewGameOdds(string id, uint oddsId);

    event LogUpdatedGameOdds(string id, uint oddsId);

    event LogNewBet(string gameId, uint oddsId, address bettor, uint betId);

    event LogClaimedBet(string gameId, uint oddsId, address bettor,
    address assistedClaimant, uint betId, uint payout);

    event Deposit(address _address, uint amount, uint session, uint balance);

    event Withdraw(address _address, uint amount, uint session, uint balance);

    // Constructor.
    function BettingProvider(address decentBetTokenAddress,
    address _houseAddress, address bettingProviderHelperAddress) {
        if (decentBetTokenAddress == 0) throw;
        if (_houseAddress == 0) throw;
        if (bettingProviderHelperAddress == 0) throw;
        name = 'Betting Provider';
        houseAddress = _houseAddress;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
        house = AbstractHouse(houseAddress);
        bettingProviderHelper =
        AbstractBettingProviderHelper(bettingProviderHelperAddress);
    }

    // Modifiers.
    modifier onlyHouse() {
        if(houseAddress != msg.sender) throw;
        _;
    }

    modifier onlySportsOracle() {
        if(sportsOracleAddress != msg.sender) throw;
        _;
    }

    modifier onlyAuthorized() {
        if (house.authorized(msg.sender) == false) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" dbets in their token contract balance.
    modifier isDbetsAvailable(uint amount) {
        if(decentBetToken.balanceOf(msg.sender) < amount) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" tokens in their depositedTokens balance.
    modifier isTokensAvailable(uint amount) {
        if (depositedTokens[msg.sender][currentSession] < amount) throw;
        _;
    }

    // Allows functions to execute only if game exists.
    modifier isValidGame(string id) {
        if (games[id].exists == false) throw;
        _;
    }

    // Allows functions to execute only if current block is earlier than the cutoff block.
    modifier isBeforeGameCutoff(string id) {
        if (block.number >= (games[id].cutOffBlock)) throw;
        _;
    }

    // Allows functions to execute only if a game is past end time.
    modifier isPastGameEndBlock(string id) {
        if (now < games[id].endBlock) throw;
        _;
    }

    // Allows functions to execute only if a game is past end time and is marked as ended.
    modifier isGameProfitsClaimable(string id) {
        if (block.number < games[id].endBlock + RESULT_OFFSET_HOURS ||
        !games[id].hasEnded) throw;
        _;
    }

    // Allows functions to execute only if a bet has been placed.
    modifier isValidBet(string gameId, uint betId) {
        if (games[gameId].bettors[msg.sender].bets[betId].exists == false) throw;
        _;
    }

    modifier isUnclaimedBet(string gameId, uint betId, address bettor) {
        if(bettor == address(0x0))
        bettor = msg.sender;
        if (games[gameId].bettors[bettor].bets[betId].claimed) throw;
        _;
    }

    // Allows function to execute only if the odds are valid.
    modifier isValidOdds(string gameId, uint oddsId) {
        if (!games[gameId].odds.odds[oddsId].exists) throw;
        _;
    }

    // Allows functions to execute only if the session is prior or equal to current house session
    // and if session is not 0.
    modifier isValidPriorSession(uint session) {
        if(session > currentSession || session == 0) throw;
        _;
    }

    // Allows the house to set the current session.
    function setSession(uint session)
    onlyHouse returns (bool) {
        currentSession = session;
        return true;
    }

    // Sets the oracle that can set results for this provider.
    function setSportsOracle(address _address)
    onlyAuthorized returns (bool) {
        sportsOracleAddress = _address;
        sportsOracle = AbstractSportsOracle(_address);
    }

    // Allows the house to add funds to the provider for this session or the next.
    function houseDeposit(uint amount, uint session)
    onlyHouse
    onlyAuthorized returns (bool) {
        uint currentSession = currentSession;
        // House deposits are allowed only for this session or the next.
        if(session == 0 || session < currentSession || session > (currentSession + 1)) return false;

        // Record the total number of tokens deposited into the house.
        depositedTokens[houseAddress][session] = safeAdd(depositedTokens[houseAddress][session], amount);
        sessionStats[session].totalDeposited = safeAdd(sessionStats[session].totalDeposited, amount);

        // Transfer tokens from house to betting provider.
        if(!decentBetToken.transferFrom(msg.sender, address(this), amount)) return false;

        Deposit(houseAddress, amount, session, depositedTokens[houseAddress][session]);
        return true;
    }

    // Allows house to withdraw session tokens for the previous session.
    function withdrawPreviousSessionTokens()
    onlyHouse returns (bool) {
        uint previousSession = currentSession - 1;
        if(depositedTokens[address(this)][previousSession] == 0) return false;
        if(!decentBetToken.transfer(msg.sender, depositedTokens[address(this)][previousSession])) return false;
        return true;
    }

    // Deposits DBET to contract for the current session.
    // User needs to approve contract address for amount prior to calling this function.
    function deposit(uint amount)
    isDbetsAvailable(amount) returns (bool) {
        uint currentSession = currentSession;
        depositedTokens[msg.sender][currentSession] =
        safeAdd(depositedTokens[msg.sender][currentSession], amount);
        if(!decentBetToken.transferFrom(msg.sender, address(this), amount)) return false;
        Deposit(msg.sender, amount, currentSession, depositedTokens[msg.sender][currentSession]);
        return true;
    }

    // Withdraw DBETS from contract to sender address.
    function withdraw(uint amount, uint session)
    isValidPriorSession(session)
    isTokensAvailable(amount) returns (bool) {
        depositedTokens[msg.sender][session] = safeSub(depositedTokens[msg.sender][session], amount);
        if(!decentBetToken.transfer(msg.sender, amount)) return false;
        Withdraw(msg.sender, amount, session, depositedTokens[msg.sender][session]);
        return true;
    }

    // Query balance of deposited tokens for a user.
    function balanceOf(address _address, uint session) returns(uint) {
        return depositedTokens[_address][session];
    }

    // Changes assisted claim block offset.
    function changeAssistedClaimBlockOffset (uint offset)
    onlyAuthorized {
        ASSISTED_CLAIM_BLOCK_OFFSET = offset;
    }

    // Adds a game to the contract.
    // 800k gas.
    function addGame(string id, uint oracleGameId, uint maxSpreadBet,
    uint maxMoneylineBet, uint maxTotalsBet, uint maxTeamTotalsBet,
    uint cutOffBlock, uint endBlock)
    onlyAuthorized {
        if(!sportsOracle.addProviderGameToUpdate(oracleGameId, id)) throw;
            throw;
        games[id] = Game({
            session: currentSession,
            oracleGameId : oracleGameId,
            odds : GameOdds(new uint[](0), 0),
            bettorsList: new address[](0),
            betAmount: 0,
            payouts: 0,
            betCount : 0,
            betLimits : [maxSpreadBet, maxMoneylineBet,
            maxTotalsBet, maxTeamTotalsBet],
            cutOffBlock : cutOffBlock,
            endBlock : endBlock,
            hasEnded : false,
            exists : true
        });
        availableGames.push(id);
        LogNewGame(id, oracleGameId, cutOffBlock, endBlock);
    }

    // Handicap must be multiplied by 100.
    // 500k gas.
    function pushGameOdds(string id, string refId, uint period,
    int handicap, int team1, int team2, int draw, uint betType,
    uint points, int over, int under, bool isTeam1)
    onlyAuthorized
    isValidGame(id)
    isBeforeGameCutoff(id) {
        if(handicap % 25 != 0) throw;
        Odds memory odds = Odds({
            betType: betType,
            refId: refId,
            period: period,
            handicap: (betType == ODDS_TYPE_SPREAD ? handicap : 0),
            team1: (betType == ODDS_TYPE_SPREAD || betType == ODDS_TYPE_MONEYLINE) ? team1 : 0,
            team2: (betType == ODDS_TYPE_SPREAD || betType == ODDS_TYPE_MONEYLINE) ? team2 : 0,
            draw: betType == ODDS_TYPE_MONEYLINE ? draw : 0,
            points: (betType == ODDS_TYPE_TOTAL || betType == ODDS_TYPE_TEAM_TOTAL) ? points : 0,
            over: (betType == ODDS_TYPE_TOTAL || betType == ODDS_TYPE_TEAM_TOTAL) ? over : 0,
            under: (betType == ODDS_TYPE_TOTAL || betType == ODDS_TYPE_TEAM_TOTAL) ? under : 0,
            isTeam1: (betType == ODDS_TYPE_TOTAL || betType == ODDS_TYPE_TEAM_TOTAL) ? isTeam1 : false,
            isActive: true,
            updateBlock: block.number,
            exists: true
        });
        pushOdds(id, odds);
    }

    // Updates odds for a game. Until a timeout of say 300 seconds, has passed,
    // previous odds would still be active, till new odds are enforced.
    // 300k gas.
    function updateGameOdds(string id, uint oddsId, int handicap, int team1,
    int team2, int draw, uint points, int over, int under)
    onlyAuthorized
    isValidGame(id)
    isBeforeGameCutoff(id)
    returns (bool updated) {
        games[id].odds.odds[oddsId].handicap = handicap;
        games[id].odds.odds[oddsId].team1 = team1;
        games[id].odds.odds[oddsId].team2 = team2;
        games[id].odds.odds[oddsId].draw = draw;
        games[id].odds.odds[oddsId].points = points;
        games[id].odds.odds[oddsId].over = over;
        games[id].odds.odds[oddsId].under = under;
        games[id].odds.odds[oddsId].updateBlock = block.number;
        LogUpdatedGameOdds(id, oddsId);
    }

    // Updates the outcome of a game.
    function updateGameOutcome(string id, uint period, int result, uint team1Points, uint team2Points)
    onlySportsOracle
    isValidGame(id)
    isPastGameEndBlock(id)
    returns (bool updated) {
        games[id].outcomes[period] = Outcome({
            result: result,
            team1Points: team1Points,
            team2Points: team2Points,
            totalPoints: safeAdd(team1Points, team2Points),
            isPublished: true,
            settleBlock: block.number
        });
        games[id].hasEnded = true;
        return true;
    }

    // Place a bet on a game based on listed odds.
    // 1M gas.
    function placeBet(string gameId, uint oddsId, uint betType, uint choice, uint amount)
    isTokensAvailable(amount)
    isValidGame(gameId)
    isBeforeGameCutoff(gameId)
    isValidOdds(gameId, oddsId)
    returns (bool betPlaced) {

        // Odds sent in function call were different from that on contract.
        // Don't allow function call to continue.
        if (games[gameId].odds.odds[oddsId].betType != betType) throw;

        // Cannot bet more than limit for selected bet type.
        if(games[gameId].betLimits[betType] < amount) throw;

        // Game must be from current session.
        if(games[gameId].session != currentSession) throw;

        games[gameId].betAmount = safeAdd(games[gameId].betAmount, amount);
        games[gameId].betCount = safeAdd(games[gameId].betCount, 1);
        sessionStats[currentSession].totalBetAmount =
        safeAdd(sessionStats[currentSession].totalBetAmount, amount);

        uint betId = games[gameId].bettors[msg.sender].betCount;

        // Add the bet to user bets mapping for front-end reference.
        games[gameId].bettors[msg.sender].bets[games[gameId].bettors[msg.sender].betCount] = Bet({
            id : betId,
            oddsId: oddsId,
            odds : games[gameId].odds.odds[oddsId],
            choice: choice,
            amount : amount,
            blockNumber: block.number,
            session : currentSession,
            exists : true,
            claimed : false
        });

        // Iterate bet count for user.
        games[gameId].bettors[msg.sender].betCount =
        safeAdd(games[gameId].bettors[msg.sender].betCount, 1);

        userBets[msg.sender].gameIds.push(gameId);

        // Provider holds tokens for duration of the bet.
        depositedTokens[address(this)][currentSession] =
            safeAdd(depositedTokens[address(this)][currentSession], amount);
        depositedTokens[msg.sender][currentSession] =
            safeSub(depositedTokens[msg.sender][currentSession], amount);

        LogNewBet(gameId, oddsId, msg.sender, betId);
    }

    // Claim winnings for a bet.
    // 780k gas.
    function claimBet(string gameId, uint betId, address bettor)
    isValidGame(gameId)
    isValidBet(gameId, betId)
    isUnclaimedBet(gameId, betId, bettor)
    isGameProfitsClaimable(gameId) {

        if(bettor == address(0x0))
        bettor = msg.sender;

        // Assisted claims can be made only after offset blocks
        // have been passed from endTime.
        if(bettor != msg.sender && block.number >= games[gameId].endBlock + ASSISTED_CLAIM_BLOCK_OFFSET) throw;

        uint betReturns = getBetReturns(gameId, betId, bettor);
        uint betSession = games[gameId].bettors[bettor].bets[betId].session;

        if(betReturns == 0) {
            uint amount = games[gameId].bettors[bettor].bets[betId].amount;
            sessionStats[betSession].totalProfit =
            safeAdd(sessionStats[betSession].totalProfit, amount);
        } else {

            if(bettor == msg.sender) {
                depositedTokens[bettor][betSession] =
                    safeAdd(depositedTokens[bettor][betSession], betReturns);
            } else {
                depositedTokens[bettor][betSession] =
                    safeAdd(depositedTokens[bettor][betSession], safeDiv(safeMul(99, betReturns), 100));
                depositedTokens[msg.sender][betSession] =
                    safeAdd(depositedTokens[bettor][betSession], safeDiv(safeMul(1, betReturns), 100));
            }
            recordClaimedBet(gameId, betId, bettor, betReturns);
        }
    }

    // Record a claimed bet. Split claim bet into two functions to avoid stack too deep error.
    function recordClaimedBet(string gameId, uint betId, address bettor, uint betReturns) internal {
        games[gameId].bettors[bettor].bets[betId].claimed = true;
        games[gameId].payouts =
            safeAdd(games[gameId].payouts, betReturns);
        sessionStats[currentSession].totalPayout =
            safeAdd(sessionStats[currentSession].totalPayout, betReturns);

        LogClaimedBet(gameId, games[gameId].bettors[bettor].bets[betId].oddsId,
        bettor, (bettor != msg.sender) ? msg.sender : address(0x0), betId, betReturns);
    }

    // Internal calls
    // Calculates returns for a bet based on the bet type.
    function getBetReturns(string gameId, uint betId, address bettor) internal returns (uint) {

        Bet bet = games[gameId].bettors[bettor].bets[betId];
        Outcome outcome = games[gameId].outcomes[bet.odds.period];
        uint choice = bet.choice;
        uint amount = bet.amount;
        Odds odds = bet.odds;
        uint betType = odds.betType;
        int handicap = odds.handicap;
        int result = outcome.result;

        if(betType == ODDS_TYPE_SPREAD) {

            int teamOdds = (choice == BET_CHOICE_TEAM1 ? bet.odds.team1 :
            bet.odds.team2);

            return bettingProviderHelper.getSpreadReturns(amount, handicap,
            outcome.team1Points, outcome.team2Points, choice, teamOdds);

        } else if(betType == ODDS_TYPE_MONEYLINE) {

            if(result == RESULT_TEAM1_WIN && choice == BET_CHOICE_TEAM1){
                return safeAdd(amount, getWinnings(amount, odds.team1));
            } else if(result == RESULT_TEAM2_WIN && choice == BET_CHOICE_TEAM2){
                return safeAdd(amount, getWinnings(amount, odds.team2));
            } else if(result == RESULT_DRAW && choice == BET_CHOICE_DRAW){
                return safeAdd(amount, getWinnings(amount, odds.draw));
            } else {
                return 0;
            }

        } else if(betType == ODDS_TYPE_TOTAL || betType == ODDS_TYPE_TEAM_TOTAL) {

            uint points = (betType == ODDS_TYPE_TOTAL ? outcome.totalPoints :
            (odds.isTeam1 ? outcome.team1Points : outcome.team2Points));

            if(safeMul(points, 100) > odds.points && choice == BET_CHOICE_OVER) {
                return safeAdd(amount, getWinnings(amount, odds.over));
            } else if(safeMul(points, 100) < odds.points && choice == BET_CHOICE_UNDER) {
                return safeAdd(amount, getWinnings(amount, odds.under));
            } else {
                return 0;
            }

        } else {
            throw;
        }
    }

    // Returns the winnings based on american format odds (+100/-100)
    function getWinnings(uint amount, int odds) internal returns (uint) {
        uint absOdds = (uint) (odds);
        if(odds < 0) {
            // Amount / (odds/100)
            return safeDiv(amount, safeDiv(absOdds, 100));
        } else if(odds > 0) {
            // Amount * (odds/100)
            return safeMul(amount, safeDiv(absOdds, 100));
        } else if(odds == 0) {
            return amount;
        }
        return 0;
    }

    // Split into an additional function to avoid stack too deep error.
    function pushOdds(string gameId, Odds odds) internal returns (bool) {
        games[gameId].odds.odds[games[gameId].odds.oddsCount] = odds;
        games[gameId].odds.ids.push(games[gameId].odds.oddsCount);
        games[gameId].odds.oddsCount++;
        LogNewGameOdds(gameId, games[gameId].odds.oddsCount + 1);
        return true;
    }

    // Don't allow ETH to be sent to this contract
    function() {
        throw;
    }

}
