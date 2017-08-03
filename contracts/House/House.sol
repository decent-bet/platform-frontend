pragma solidity ^0.4.8;

import '../Libraries/SafeMath.sol';
import '../Token/AbstractDecentBetToken.sol';
import '../Betting/AbstractSportsOracle.sol';
import './HouseOffering.sol';

// Decent.bet House Contract.
// All credits and payouts are in DBETs and are 18 decimal places in length.
contract House is SafeMath {

    // Structs
    struct UserCredits {
        uint amount;
        uint liquidated;
        uint rolledOver;
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
        uint totalWithdrawn;
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

    struct Offering {
        HouseOffering houseOffering;
        bool exists;
    }

    // Variables
    address public founder;

    address[] public houseOfferingAddresses;

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

    mapping (address => Offering) offerings;

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

    function addHouseOffering(address houseOfferingAddress)
    onlyFounder {
        houseOfferingAddresses.push(houseOfferingAddress);
            offerings[houseOfferingAddress] = Offering({
            houseOffering: HouseOffering(houseOfferingAddress),
            exists: true
        });
        LogNewHouseOffering(houseOfferingAddress, offerings[houseOfferingAddress].houseOffering.name());
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

    // Allows functions to execute only if it's currently a credit-buying period i.e
    // 1 week before the end of the current session.
    modifier isCreditBuyingPeriod() {
        if (currentSession > 0) {
            if (now < (sessions[currentSession].endTime - 1 weeks) || now > (sessions[currentSession].endTime))
            throw;
        } else {
            // Session zero hasn't started
            if (sessionZeroStartTime == 0) throw;
            // Session zero has ended
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

    // Allows functions to execute only if users have rolled over credits available for "session".
    modifier areRolledOverCreditsAvailable(uint session) {
        if (houseFunds[session].userCredits[msg.sender].rolledOver == 0) throw;
        _;
    }

    // Allows functions to execute only if the profit distribution period is going on i.e
    // after the end of the previous session.
    modifier isProfitDistributionPeriod(uint session) {
        if (session == 0) throw;
        if (now < sessions[session].endTime + 4 days) throw;
        _;
    }

    // Allows functions to execute only if it is the end of the current session
    modifier isEndOfSession() {
        if (currentSession == 0) throw;
        if (now < sessions[currentSession].endTime) throw;
        _;
    }

    modifier isValidHouseOffering(address offering) {
        if(!offerings[offering].exists) throw;
        _;
    }

    // Events
    event LogPurchasedCredits(address creditHolder, uint session, uint amount);

    event LogLiquidateCredits(address creditHolder, uint session, uint amount, uint payout);

    event LogPayoutRolledOverCredits(address creditHolder, uint session, uint amount, uint payout);

    event LogRolledOverCredits(address creditHolder, uint session, uint amount);

    event LogNewSession(uint session, uint startTimestamp, uint startBlockNumber, uint endTimestamp, uint endBlockNumber);

    event LogNewHouseOffering(address offeringAddress, bytes32 name);

    // Adds an address to the list of authorized addresses.
    function addToAuthorizedAddresses(address _address)
    onlyFounder {
        authorizedAddresses.push(_address);
        authorized[_address] = true;
    }

    // Removes an address from the list of authorized addresses.
    function removeFromAuthorizedAddresses(address _address)
    onlyFounder {
        if (authorized[_address] == false) throw;
        for (uint i = 0; i < authorizedAddresses.length; i++) {
            if (authorizedAddresses[i] == _address) {
                delete authorizedAddresses[i];
                authorized[_address] = false;
                break;
            }
        }
    }

    // Transfers DBETs from users to house contract address and generates credits in return.
    // House contract must be approved to transfer amount from msg.sender to house.
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
        if (!decentBetToken.transferFrom(msg.sender, address(this), amount)) throw;

        LogPurchasedCredits(msg.sender, currentSession, amount);
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
        if (!decentBetToken.transfer(msg.sender, payout)) throw;

        LogLiquidateCredits(msg.sender, session, amount, payout);
    }

    function payoutRolledOverCredits(uint session)
    areRolledOverCreditsAvailable(session)
    isProfitDistributionPeriod(session) {
        // Calculate payout for rolled over credit.
        uint payoutPerCredit = getPayoutPerCredit(session);
        uint rolledOver = houseFunds[session].userCredits[msg.sender].rolledOver;
        uint payout = safeMul(payoutPerCredit, rolledOver);

        if(!decentBetToken.transfer(msg.sender, payout)) throw;

        LogPayoutRolledOverCredits(msg.sender, session, rolledOver, payout);
    }

    // Returns the payout per credit based on the house winnings for a session.
    function getPayoutPerCredit(uint session) returns (uint) {

        uint sessionProfit = houseFunds[session].profit;
        uint totalPurchasedUserCredits = houseFunds[session].totalPurchasedUserCredits;

        // ((Total User Credits / Session profits) * 100) * PROFIT_SHARE_PERCENT/100;
        return safeMul(safeMul(safeDiv(totalPurchasedUserCredits, sessionProfit), 100),
        safeDiv(PROFIT_SHARE_PERCENT, 100));
    }

    // Allows users holding credits in the current session to roll over their credits to the
    // next session.
    function rollOverCredits(uint amount)
    areCreditsAvailable(currentSession, amount)
    isCreditBuyingPeriod {

        // Payout and current session variables.
        uint credits = houseFunds[currentSession].userCredits[msg.sender].amount;

        // Next session variables.
        uint nextSession = safeAdd(currentSession, 1);
        uint totalUserCreditsForNextSession = houseFunds[nextSession].userCredits[msg.sender].amount;

        // Rollover credits from current session to next.
        houseFunds[currentSession].userCredits[msg.sender].amount = safeSub(credits, amount);
        houseFunds[currentSession].userCredits[msg.sender].rolledOver = safeAdd(credits, amount);

        // Add to credits for next session.
        houseFunds[nextSession].userCredits[msg.sender].amount = safeAdd(totalUserCreditsForNextSession, amount);
        houseFunds[nextSession].totalPurchasedUserCredits = safeAdd(houseFunds[nextSession].totalUserCredits, amount);
        houseFunds[nextSession].totalFunds = safeAdd(houseFunds[nextSession].totalFunds, amount);

        LogRolledOverCredits(msg.sender, currentSession, amount);
    }

    // Withdraws session tokens from the previously ended session from betting provider.
    function withdrawPreviousSessionTokensFromHouseOffering(address houseOffering)
    isValidHouseOffering(houseOffering)
    onlyAuthorized {
        uint previousSession = currentSession - 1;
        // Withdrawals are only allowed after session 1.
        if(currentSession <= 1) throw;

        // Tokens can only be withdrawn 48h after the previous session has ended to account for pending bets.
        if(now < sessions[previousSession].endTime + 2 days) throw;

        uint previousSessionTokens = offerings[houseOffering].houseOffering.balanceOf(address(this), previousSession);

        // Withdraw from previous session
        if(!offerings[houseOffering].houseOffering.withdrawPreviousSessionTokens()) throw;

        houseFunds[previousSession].totalWithdrawn =
        safeAdd(houseFunds[previousSession].totalWithdrawn, previousSessionTokens);
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
        } else {
            // TODO Deposit %age of tokens to all offerings
            sessions[nextSession].startTime = now;
            sessions[nextSession].endTime = safeAdd(sessions[nextSession].startTime, 12 weeks);
            // For a session to be considered active, now would need to be between startTime and endTime
            // AND session should be active.
            sessions[nextSession].active = true;
        }
        currentSession = nextSession;

        // TODO Set session for all offerings
        //        bettingProvider.setSession(nextSession);
        LogNewSession(nextSession, sessions[nextSession].startTime, 0, sessions[nextSession].endTime, 0);
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
