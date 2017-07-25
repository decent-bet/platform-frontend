pragma solidity ^0.4.8;


import './SafeMath.sol';
import './AbstractDecentBetToken.sol';


// Decent.bet House Contract.
// All shares and payouts are in DBETs and have upto 3 decimal places.

contract House is SafeMath {

    // Structs //
    struct UserShares {
        uint amount;
        bool exists;
    }

    struct HouseFunds {
        uint totalFunds;
        uint totalPurchasedUserShares;
        uint totalUserShares;
        mapping (address => UserShares) userShares;
        address[] users;
        uint winnings;
        mapping (address => uint) payouts;
        uint totalHousePayouts;
    }

    struct Shares {
        // Quarter => amount
        mapping (uint => uint) amounts;
        bool exists;
    }

    struct Quarter {
        uint startTime;
        uint endTime;
        bool active;
    }

    // Variables //
    address public founder;

    address public sportsBettingAddress;

    address[] public authorizedAddresses;

    uint public constant profitSharePercent = 95;

    bool public isActive = false;

    // Starting quarter will be at 0.
    // This would be the share buying period for the 1st quarter of the house and lasts only for 1 week.
    uint public currentQuarter = 0;

    // Time quarter 0 begins.
    uint public zeroQuarterStartTime = 0;

    // External Contracts //
    AbstractDecentBetToken public decentBetToken;

    // Mappings //
    // House funds per quarter
    mapping (uint => HouseFunds) public houseFunds;

    mapping (address => bool) public authorized;

    mapping (uint => Quarter) public quarters;

    // Constructor //
    function House(address decentBetTokenAddress) {
        if (decentBetTokenAddress == 0) throw;
        founder = msg.sender;
        authorizedAddresses.push(founder);
        authorized[founder] = true;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
    }

    function setSportsBettingContract(address _sportsBettingAddress)
    onlyFounder
    returns (bool ok) {
        sportsBettingAddress = _sportsBettingAddress;
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

    modifier onlySportsBettingContract() {
        if (sportsBettingAddress == 0x0) throw;
        if (msg.sender != sportsBettingAddress) throw;
        _;
    }

    // Allows functions to execute only if it's currently a share-buying period i.e
    // 1 week before the end of the current quarter.
    modifier isShareBuyingPeriod() {
        if (currentQuarter > 0) {
            if (now < (quarters[currentQuarter].endTime - 1 weeks) ||
            now > (quarters[currentQuarter].endTime + 1 weeks))
            throw;
        }
        else {
            if (zeroQuarterStartTime == 0) throw;
            if (now > zeroQuarterStartTime + 1 weeks) throw;
        }
        _;
    }

    // Allows functions to execute only if users have "amount" tokens in their balance.
    modifier isTokensAvailable(uint amount) {
        if (decentBetToken.balanceOf(msg.sender) < amount) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" shares available for "quarter".
    modifier isSharesAvailable(uint quarter, uint amount) {
        if (houseFunds[quarter].userShares[msg.sender].amount < amount) throw;
        _;
    }

    // Allows functions to execute only if the profit distribution period is going on i.e
    // after the end of the previous quarter.
    modifier isProfitDistributionPeriod(uint quarter) {
        if (quarter == 0) throw;
        if (now < quarters[quarter].endTime) throw;
        _;
    }

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
    function transferWinnings(address winner, uint amount)
    onlySportsBettingContract
    returns (bool ok) {
        if (!decentBetToken.transfer(winner, amount)) throw;
        return true;
    }

    // Transfers DBETs from users to house contract address and generates shares in return.
    function purchaseShares(uint amount)
    isShareBuyingPeriod
    isTokensAvailable(amount)
    returns (bool purchased) {

        // Issue shares to user equivalent to amount transferred.
        uint nextQuarter = safeAdd(currentQuarter, 1);

        // Transfer tokens to house contract address.
        if (!decentBetToken.transfer(address(this), amount)) throw;

        // Add to house and user funds.
        houseFunds[nextQuarter].totalFunds = safeAdd(houseFunds[nextQuarter].totalFunds, amount);
        houseFunds[nextQuarter].totalPurchasedUserShares =
        safeAdd(houseFunds[nextQuarter].totalPurchasedUserShares, amount);
        houseFunds[nextQuarter].totalUserShares = safeAdd(houseFunds[nextQuarter].totalUserShares, amount);
        houseFunds[nextQuarter].userShares[msg.sender].amount =
        safeAdd(houseFunds[nextQuarter].userShares[msg.sender].amount, amount);

        // Add user to house users array for UI iteration purposes.
        if (houseFunds[nextQuarter].userShares[msg.sender].exists == false) {
            houseFunds[nextQuarter].users.push(msg.sender);
            houseFunds[nextQuarter].userShares[msg.sender].exists = true;
        }

        houseFunds[nextQuarter].userShares[msg.sender].amount += amount;
    }

    // Returns the payout per share based on the house winnings for a quarter.
    function getPayoutPerShare(uint quarter) returns (uint) {

        uint quarterWinnings = houseFunds[quarter].winnings;
        uint totalPurchasedUserShares = houseFunds[quarter].totalPurchasedUserShares;

        // ((Total User Shares / Quarter winnings) * 100) * 50/100;
        return safeMul(safeMul(safeDiv(totalPurchasedUserShares, quarterWinnings), 100), safeDiv(50, 100));
    }

    // Allows users to return shares and receive tokens along with profit in return.
    function liquidateShares(uint quarter, uint amount)
    isSharesAvailable(quarter, amount)
    isProfitDistributionPeriod(quarter) returns (uint){

        // Payout and current quarter variables.
        uint payoutPerShare = getPayoutPerShare(quarter);
        uint shares = houseFunds[quarter].userShares[msg.sender].amount;
        uint paidOut = houseFunds[quarter].payouts[msg.sender];
        uint totalHousePayouts = houseFunds[quarter].totalHousePayouts;
        uint totalUserShares = houseFunds[quarter].totalUserShares;
        uint payout = safeMul(payoutPerShare, amount);

        // Payout users for current quarter and liquidate shares.
        houseFunds[quarter].payouts[msg.sender] = safeAdd(paidOut, payout);
        houseFunds[quarter].totalUserShares = safeSub(totalUserShares, amount);
        houseFunds[quarter].userShares[msg.sender].amount = safeSub(shares, amount);
        houseFunds[quarter].totalHousePayouts = safeAdd(totalHousePayouts, payout);

        // Transfers from house to user.
        if (!decentBetToken.transferFrom(address(this), msg.sender, payout)) throw;

        // Returns payout to user for UI purposes.
        return payout;
    }

    // Allows users holding shares in the current quarter to roll over their shares to the
    // next quarter and receive profits for current quarter.
    function rollOverShares(uint amount)
    isSharesAvailable(currentQuarter, amount)
    isShareBuyingPeriod returns (uint){

        // Payout and current quarter variables.
        uint payoutPerShare = getPayoutPerShare(currentQuarter);
        uint shares = houseFunds[currentQuarter].userShares[msg.sender].amount;
        uint paidOut = houseFunds[currentQuarter].payouts[msg.sender];
        uint totalHousePayouts = houseFunds[currentQuarter].totalHousePayouts;
        uint payout = safeMul(payoutPerShare, amount);

        // Next quarter variables.
        uint nextQuarter = currentQuarter + 1;
        uint totalUserSharesForNextQuarter = houseFunds[nextQuarter].userShares[msg.sender].amount;

        // Payout users for current quarter and liquidate shares.
        houseFunds[currentQuarter].payouts[msg.sender] = safeAdd(paidOut, payout);
        houseFunds[currentQuarter].userShares[msg.sender].amount = safeSub(shares, amount);
        houseFunds[currentQuarter].totalHousePayouts = safeAdd(totalHousePayouts, payout);

        // Add to shares for next quarter.
        houseFunds[nextQuarter].userShares[msg.sender].amount = safeAdd(shares, amount);
        houseFunds[nextQuarter].totalUserShares = safeAdd(totalUserSharesForNextQuarter, amount);

        // Transfers from house to user.
        if (!decentBetToken.transferFrom(address(this), msg.sender, payout)) throw;

        // Returns payout to user for UI purposes.
        return payout;
    }

    // Starts the next quarter.
    function beginNextQuarter()
    onlyAuthorized {
        uint nextQuarter = currentQuarter + 1;
        if (currentQuarter == 0) {
            zeroQuarterStartTime = now;
            // One week grace period to buy shares.
            quarters[nextQuarter].startTime = zeroQuarterStartTime + 1 weeks;
            quarters[nextQuarter].endTime = zeroQuarterStartTime + 13 weeks;
            // For a quarter to be considered active, now would need to be between startTime and endTime
            // AND quarter should be active.
            quarters[nextQuarter].active = true;
        }
        else {
            uint currentQuarterEndTime = quarters[currentQuarter].endTime;
            quarters[nextQuarter].startTime = currentQuarterEndTime;
            quarters[nextQuarter].endTime = currentQuarterEndTime + 12 weeks;
            // For a quarter to be considered active, now would need to be between startTime and endTime
            // AND quarter should be active.
            quarters[nextQuarter].active = true;
        }
    }

    // Utility functions for front-end purposes.
    function getUserSharesForQuarter(uint quarter, address _address)
    returns (uint amount) {
        return houseFunds[quarter].userShares[_address].amount;
    }

    // Do not accept ETH sent to this contract.
    function() {
        throw;
    }

}
