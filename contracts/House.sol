pragma solidity ^0.4.8;


import './SafeMath.sol';
import './AbstractDecentBetToken.sol';
import './AbstractSportsOracle.sol';

// Decent.bet House Contract.
// All credits and payouts are in DBETs and are 18 decimal places in length.
contract House is SafeMath {

    // Structs
    struct UserCredits {
        uint amount;
        uint liquidated;
        bool exists;
    }

    struct HouseFunds {
        uint totalFunds;
        uint totalPurchasedUserCredits;
        uint totalUserCredits;
        mapping (address => UserCredits) userCredits;
        mapping (address => uint) payouts;
        address[] users;
        uint totalHousePayouts;
        uint profit;
    }

    struct Credits {
        // Session => amount
        mapping (uint => uint) amounts;
        bool exists;
    }

    struct Session {
        uint startTime;
        uint endTime;
        bool active;
    }

    // Variables
    address public founder;

    address public bettingProviderAddress;

    address[] public authorizedAddresses;

    uint public constant PROFIT_SHARE_PERCENT = 95;

    bool public isActive = false;

    // Starting session will be at 0.
    // This would be the credit buying period for the 1st session of the house and lasts only for 1 week.
    uint public currentSession = 0;

    // Time session 0 begins.
    uint public sessionZeroStartTime = 0;

    // External Contracts
    AbstractDecentBetToken public decentBetToken;

    // Mappings
    // House funds per session
    mapping (uint => HouseFunds) public houseFunds;

    mapping (address => bool) public authorized;

    mapping (uint => Session) public sessions;

    // Constructor
    function House(address decentBetTokenAddress) {
        if (decentBetTokenAddress == 0) throw;
        founder = msg.sender;
        authorizedAddresses.push(founder);
        authorized[founder] = true;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
    }

    function setBettingProvider(address _bettingProviderAddress)
    onlyFounder
    returns (bool ok) {
        bettingProviderAddress = _bettingProviderAddress;
        return true;
    }

    // Modifiers //
    modifier onlyFounder() {
        if (msg.sender != founder) throw;
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender == 0x0) throw;
        if (authorized[msg.sender] == false) throw;
        _;
    }

    modifier onlyBettingProvider() {
        if (bettingProviderAddress == 0x0) throw;
        if (msg.sender != bettingProviderAddress) throw;
        _;
    }

    // Allows functions to execute only if it's currently a credit-buying period i.e
    // 1 week before the end of the current session.
    modifier isCreditBuyingPeriod() {
        if (currentSession > 0) {
            if (now < (sessions[currentSession].endTime - 1 weeks) ||
            now > (sessions[currentSession].endTime + 1 weeks))
            throw;
        }
        else {
            if (sessionZeroStartTime == 0) throw;
            if (now > sessionZeroStartTime + 1 weeks) throw;
        }
        _;
    }

    // Allows functions to execute only if users have "amount" tokens in their balance.
    modifier areTokensAvailable(uint amount) {
        if (decentBetToken.balanceOf(msg.sender) < amount) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" credits available for "session".
    modifier areCreditsAvailable(uint session, uint amount) {
        if (houseFunds[session].userCredits[msg.sender].amount < amount) throw;
        _;
    }

    // Allows functions to execute only if the profit distribution period is going on i.e
    // after the end of the previous session.
    modifier isProfitDistributionPeriod(uint session) {
        if (session == 0) throw;
        if (now < sessions[session].endTime) throw;
        _;
    }

    // Allows functions to execute only if it is the end of the current session
    modifier isEndOfSession() {
        if (currentSession == 0) throw;
        if (now < sessions[currentSession].endTime) throw;
        _;
    }

    // Events
    event LogPurchasedCredits(address creditHolder, uint session, uint amount);

    event LogLiquidateCredits(address creditHolder, uint session, uint amount);

    event LogRolledOverCredits(address creditHolder, uint session, uint amount);

    event LogNewSession(uint session, uint startTimestamp, uint startBlockNumber,
    uint endTimestamp, uint endBlockNumber);

    // Adds an address to the list of authorized addresses.
    function addToAuthorizedAddresses(address _address)
    onlyFounder
    returns (bool ok) {
        authorizedAddresses.push(_address);
        authorized[_address] = true;
        return true;
    }

    // Removes an address from the list of authorized addresses.
    function removeFromAuthorizedAddresses(address _address)
    onlyFounder
    returns (bool ok) {
        if (authorized[_address] == false) throw;
        for (uint i = 0; i < authorizedAddresses.length; i++) {
            if (authorizedAddresses[i] == _address) {
                delete authorizedAddresses[i];
                authorized[_address] = false;
                break;
            }
        }
        return true;
    }

    // Approves a transfer from the house address.
    function transferProfits(address winner, uint amount)
    onlyBettingProvider
    internal
    returns (bool ok) {
        if (!decentBetToken.transfer(winner, amount)) throw;
        return true;
    }

    // Transfers DBETs from users to house contract address and generates credits in return.
    function purchaseCredits(uint amount)
    isCreditBuyingPeriod
    areTokensAvailable(amount) {

        // Issue credits to user equivalent to amount transferred.
        uint nextSession = safeAdd(currentSession, 1);

        // Add to house and user funds.
        houseFunds[nextSession].totalFunds =
        safeAdd(houseFunds[nextSession].totalFunds, amount);
        houseFunds[nextSession].totalPurchasedUserCredits =
        safeAdd(houseFunds[nextSession].totalPurchasedUserCredits, amount);

        houseFunds[nextSession].totalUserCredits =
        safeAdd(houseFunds[nextSession].totalUserCredits, amount);
        houseFunds[nextSession].userCredits[msg.sender].amount =
        safeAdd(houseFunds[nextSession].userCredits[msg.sender].amount, amount);

        // Add user to house users array for UI iteration purposes.
        if (houseFunds[nextSession].userCredits[msg.sender].exists == false) {
            houseFunds[nextSession].users.push(msg.sender);
            houseFunds[nextSession].userCredits[msg.sender].exists = true;
        }

        houseFunds[nextSession].userCredits[msg.sender].amount =
        safeAdd(houseFunds[nextSession].userCredits[msg.sender].amount, amount);

        // Transfer tokens to house contract address.
        if (!decentBetToken.transfer(address(this), amount)) throw;

        LogPurchasedCredits(msg.sender, currentSession, amount);
    }

    // Returns the payout per credit based on the house winnings for a session.
    function getPayoutPerCredit(uint session) returns (uint) {

        uint sessionProfit = houseFunds[session].profit;
        uint totalPurchasedUserCredits = houseFunds[session].totalPurchasedUserCredits;

        // ((Total User Credits / Session winnings) * 100) * PROFIT_SHARE_PERCENT/100;
        return safeMul(safeMul(safeDiv(totalPurchasedUserCredits, sessionProfit), 100),
        safeDiv(PROFIT_SHARE_PERCENT, 100));
    }

    // Allows users to return credits and receive tokens along with profit in return.
    function liquidateCredits(uint session, uint amount)
    areCreditsAvailable(session, amount)
    isProfitDistributionPeriod(session) {

        // Payout variables
        uint payoutPerCredit = getPayoutPerCredit(session);
        // (Payout per credit * amount of credits) + amount of credits
        uint payout = safeAdd(safeMul(payoutPerCredit, amount), amount);

        // Current session variables
        uint credits = houseFunds[session].userCredits[msg.sender].amount;
        uint liquidatedCredits = houseFunds[session].userCredits[msg.sender].liquidated;
        uint paidOut = houseFunds[session].payouts[msg.sender];
        uint totalHousePayouts = houseFunds[session].totalHousePayouts;
        uint totalUserCredits = houseFunds[session].totalUserCredits;

        // Payout users for current session and liquidate credits.
        houseFunds[session].payouts[msg.sender] = safeAdd(paidOut, payout);
        houseFunds[session].totalUserCredits = safeSub(totalUserCredits, amount);
        houseFunds[session].userCredits[msg.sender].amount = safeSub(credits, amount);
        houseFunds[session].userCredits[msg.sender].liquidated = safeAdd(liquidatedCredits, amount);
        houseFunds[session].totalHousePayouts = safeAdd(totalHousePayouts, payout);

        // Transfers from house to user.
        if (!decentBetToken.transferFrom(address(this), msg.sender, payout)) throw;

        LogLiquidateCredits(msg.sender, session, amount);
    }

    // Allows users holding credits in the current session to roll over their credits to the
    // next session and receive profits for current session.
    function rollOverCredits(uint amount)
    areCreditsAvailable(currentSession, amount)
    isCreditBuyingPeriod {

        // Payout and current session variables.
        uint payoutPerCredit = getPayoutPerCredit(currentSession);
        uint credits = houseFunds[currentSession].userCredits[msg.sender].amount;
        uint paidOut = houseFunds[currentSession].payouts[msg.sender];
        uint totalHousePayouts = houseFunds[currentSession].totalHousePayouts;
        uint payout = safeMul(payoutPerCredit, amount);

        // Next session variables.
        uint nextSession = safeAdd(currentSession, 1);
        uint totalUserCreditsForNextSession = houseFunds[nextSession].userCredits[msg.sender].amount;

        // Payout users for current session and liquidate credits.
        houseFunds[currentSession].payouts[msg.sender] = safeAdd(paidOut, payout);
        houseFunds[currentSession].userCredits[msg.sender].amount = safeSub(credits, amount);
        houseFunds[currentSession].totalHousePayouts = safeAdd(totalHousePayouts, payout);

        // Add to credits for next session.
        houseFunds[nextSession].userCredits[msg.sender].amount = safeAdd(credits, amount);
        houseFunds[nextSession].totalUserCredits = safeAdd(totalUserCreditsForNextSession, amount);

        // Transfers from house to user.
        if (!decentBetToken.transferFrom(address(this), msg.sender, payout)) throw;

        LogRolledOverCredits(msg.sender, currentSession, amount);
    }

    // Starts the next session.
    function beginNextSession()
    isEndOfSession
    onlyAuthorized {
        uint nextSession = safeAdd(currentSession, 1);
        sessions[currentSession].active = false;
        if (currentSession == 0) {
            sessionZeroStartTime = now;
            // One week grace period to buy credits.
            sessions[nextSession].startTime = safeAdd(sessionZeroStartTime, 1 weeks);
            sessions[nextSession].endTime = safeAdd(sessionZeroStartTime, 13 weeks);
            // For a session to be considered active, now would need to be between startTime and endTime
            // AND session should be active.
            sessions[nextSession].active = true;
        }
        else {
            sessions[nextSession].startTime = now;
            sessions[nextSession].endTime = safeAdd(sessions[nextSession].startTime, 12 weeks);
            // For a session to be considered active, now would need to be between startTime and endTime
            // AND session should be active.
            sessions[nextSession].active = true;
        }
        LogNewSession(nextSession, sessions[nextSession].startTime, 0,
        sessions[nextSession].endTime, 0);
    }

    // Utility functions for front-end purposes.
    function getUserCreditsForSession(uint session, address _address)
    returns (uint amount) {
        return houseFunds[session].userCredits[_address].amount;
    }

    function getUserForSession(uint session, uint index)
    returns (address _address) {
        return houseFunds[session].users[index];
    }

    // Do not accept ETH sent to this contract.
    function() {
        throw;
    }

}
