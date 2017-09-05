pragma solidity ^0.4.8;


import './ERC20.sol';
import '../Libraries/SafeMath.sol';
import './MultiSigWallet.sol';

contract UpgradeAgent is SafeMath {
    address public owner;

    bool public isUpgradeAgent;

    function upgradeFrom(address _from, uint256 _value) public;

    function finalizeUpgrade() public;

    function setOriginalSupply() public;
}

/// @title Time-locked vault of tokens allocated to DecentBet after 180 days
contract DecentBetVault is SafeMath {

    // flag to determine if address is for a real contract or not
    bool public isDecentBetVault = false;

    DecentBetToken decentBetToken;

    address decentBetMultisig;

    uint256 unlockedAtTime;

    // smaller lock for testing
    uint256 public constant timeOffset = 1 years;

    /// @notice Constructor function sets the DecentBet Multisig address and
    /// total number of locked tokens to transfer
    function DecentBetVault(address _decentBetMultisig) /** internal */ {
        if (_decentBetMultisig == 0x0) throw;
        decentBetToken = DecentBetToken(msg.sender);
        decentBetMultisig = _decentBetMultisig;
        isDecentBetVault = true;
        unlockedAtTime = safeAdd(now, timeOffset);
        // 1 year later
    }

    /// @notice Transfer locked tokens to Decent.bet's multisig wallet
    function unlock() external {
        // Wait your turn!
        if (block.timestamp < unlockedAtTime) throw;
        // Will fail if allocation (and therefore toTransfer) is 0.
        if (!decentBetToken.transfer(decentBetMultisig, decentBetToken.balanceOf(this))) throw;
        // Otherwise ether are trapped here, we could disallow payable instead...
        if (!decentBetMultisig.send(this.balance)) throw;
    }

    // disallow payment after unlock block
    function() payable {
        if (block.timestamp >= unlockedAtTime) throw;
    }

}


/// @title DecentBet crowdsale contract
contract DecentBetToken is SafeMath, ERC20 {

    // flag to determine if address is for a real contract or not
    bool public isDecentBetToken = false;

    // State machine
    enum State{Waiting, PreSale, Funding, Success}

    // Token information
    string public constant name = "Decent.Bet Token";

    string public constant symbol = "DBET";

    uint256 public constant decimals = 18;  // decimal places

    uint256 public constant housePercentOfTotal = 10;

    uint256 public constant vaultPercentOfTotal = 18;

    uint256 public constant bountyPercentOfTotal = 2;

    uint256 public constant hundredPercent = 100;

    mapping (address => uint256) balances;

    mapping (address => mapping (address => uint256)) allowed;

    // Authorized addresses
    address public team;

    // For issuing tokens purchased with other currencies
    address public robot;

    // Upgrade information
    bool public finalizedUpgrade = false;

    address public upgradeMaster;

    UpgradeAgent public upgradeAgent;

    uint256 public totalUpgraded;

    // Crowdsale information
    bool public finalizedCrowdfunding = false;

    // Whitelisted addresses for pre-sale
    address[] public preSaleWhitelist;
    mapping (address => bool) public preSaleAllowed;

    uint256 public preSaleStartTime; // Pre-sale start block timestamp
    uint256 public fundingStartTime; // crowdsale start block timestamp
    uint256 public fundingEndTime; // crowdsale end block timestamp

    // DBET:ETH exchange rate - Needs to be updated at time of ICO. Price of ETH/0.125.
    // For example: If ETH/USD = 300, it would be 2400 DBETs per ETH.
    uint256 public baseTokensPerEther;
    uint256 public tokenCreationMax = safeMul(250000 ether, 1000);

    // for testing on testnet
    //uint256 public constant tokenCreationMax = safeMul(10 ether, baseTokensPerEther);
    //uint256 public constant tokenCreationMin = safeMul(3 ether, baseTokensPerEther);

    address public decentBetMultisig;

    DecentBetVault public timeVault; // DecentBet's time-locked vault

    event Upgrade(address indexed _from, address indexed _to, uint256 _value);

    event Refund(address indexed _from, uint256 _value);

    event UpgradeFinalized(address sender, address upgradeAgent);

    event UpgradeAgentSet(address agent);

    event InvestedOnBehalfOf(address investor, uint amount, string txHash);

    // Allow only the robot address to continue
    modifier onlyRobot() {
        if(msg.sender != robot) throw;
        _;
    }

    // Allow only the team address to continue
    modifier onlyTeam() {
        if(msg.sender != team) throw;
        _;
    }

    function DecentBetToken(address _decentBetMultisig,
    address _upgradeMaster, address _team,
    uint256 _baseTokensPerEther, uint256 _fundingStartTime,
    uint256 _fundingEndTime) {

        if (_decentBetMultisig == 0) throw;
        if (_team == 0) throw;
        if (_upgradeMaster == 0) throw;
        if (_baseTokensPerEther == 0) throw;

        // Crowdsale can only officially start after the current block timestamp.
        if (_fundingStartTime <= (block.timestamp)) throw;
        if (_fundingEndTime <= _fundingStartTime) throw;

        isDecentBetToken = true;

        upgradeMaster = _upgradeMaster;
        team = _team;

        baseTokensPerEther = _baseTokensPerEther;

        preSaleStartTime = _fundingStartTime - 1 days;
        fundingStartTime = _fundingStartTime;
        fundingEndTime = _fundingEndTime;

        timeVault = new DecentBetVault(_decentBetMultisig);
        if (!timeVault.isDecentBetVault()) throw;

        decentBetMultisig = _decentBetMultisig;
        if (!MultiSigWallet(decentBetMultisig).isMultiSigWallet()) throw;
    }

    function balanceOf(address who) constant returns (uint) {
        return balances[who];
    }

    /// @notice Transfer `value` DBET tokens from sender's account
    /// `msg.sender` to provided account address `to`.
    /// @notice This function is disabled during the funding.
    /// @dev Required state: Success
    /// @param to The address of the recipient
    /// @param value The number of DBETs to transfer
    /// @return Whether the transfer was successful or not
    function transfer(address to, uint256 value) returns (bool ok) {
        if (getState() != State.Success) throw;
        // Abort if crowdfunding was not a success.
        uint256 senderBalance = balances[msg.sender];
        if (senderBalance >= value && value > 0) {
            senderBalance = safeSub(senderBalance, value);
            balances[msg.sender] = senderBalance;
            balances[to] = safeAdd(balances[to], value);
            Transfer(msg.sender, to, value);
            return true;
        }
        return false;
    }

    /// @notice Transfer `value` DBET tokens from sender 'from'
    /// to provided account address `to`.
    /// @notice This function is disabled during the funding.
    /// @dev Required state: Success
    /// @param from The address of the sender
    /// @param to The address of the recipient
    /// @param value The number of DBETs to transfer
    /// @return Whether the transfer was successful or not
    function transferFrom(address from, address to, uint256 value) returns (bool ok) {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        // protect against wrapping uints
        if (balances[from] >= value &&
        allowed[from][msg.sender] >= value &&
        safeAdd(balances[to], value) > balances[to])
        {
            balances[to] = safeAdd(balances[to], value);
            balances[from] = safeSub(balances[from], value);
            allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], value);
            Transfer(from, to, value);
            return true;
        }
        else {return false;}
    }

    /// @notice `msg.sender` approves `spender` to spend `value` tokens
    /// @param spender The address of the account able to transfer the tokens
    /// @param value The amount of wei to be approved for transfer
    /// @return Whether the approval was successful or not
    function approve(address spender, uint256 value) returns (bool ok) {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        allowed[msg.sender][spender] = value;
        Approval(msg.sender, spender, value);
        return true;
    }

    /// @param owner The address of the account owning tokens
    /// @param spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address owner, address spender) constant returns (uint) {
        return allowed[owner][spender];
    }

    // Token upgrade functionality

    /// @notice Upgrade tokens to the new token contract.
    /// @dev Required state: Success
    /// @param value The number of tokens to upgrade
    function upgrade(uint256 value) external {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        if (upgradeAgent.owner() == 0x0) throw;
        // need a real upgradeAgent address
        if (finalizedUpgrade) throw;
        // cannot upgrade if finalized

        // Validate input value.
        if (value == 0) throw;
        if (value > balances[msg.sender]) throw;

        // update the balances here first before calling out (reentrancy)
        balances[msg.sender] = safeSub(balances[msg.sender], value);
        totalSupply = safeSub(totalSupply, value);
        totalUpgraded = safeAdd(totalUpgraded, value);
        upgradeAgent.upgradeFrom(msg.sender, value);
        Upgrade(msg.sender, upgradeAgent, value);
    }

    /// @notice Set address of upgrade target contract and enable upgrade
    /// process.
    /// @dev Required state: Success
    /// @param agent The address of the UpgradeAgent contract
    function setUpgradeAgent(address agent) external {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        if (agent == 0x0) throw;
        // don't set agent to nothing
        if (msg.sender != upgradeMaster) throw;
        // Only a master can designate the next agent
        upgradeAgent = UpgradeAgent(agent);
        if (!upgradeAgent.isUpgradeAgent()) throw;
        // this needs to be called in success condition to guarantee the invariant is true
        upgradeAgent.setOriginalSupply();
        UpgradeAgentSet(upgradeAgent);
    }

    /// @notice Set address of upgrade target contract and enable upgrade
    /// process.
    /// @dev Required state: Success
    /// @param master The address that will manage upgrades, not the upgradeAgent contract address
    function setUpgradeMaster(address master) external {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        if (master == 0x0) throw;
        if (msg.sender != upgradeMaster) throw;
        // Only a master can designate the next master
        upgradeMaster = master;
    }

    /// @notice finalize the upgrade
    /// @dev Required state: Success
    function finalizeUpgrade() external {
        if (getState() != State.Success) throw;
        // Abort if not in Success state.
        if (upgradeAgent.owner() == 0x0) throw;
        // we need a valid upgrade agent
        if (msg.sender != upgradeMaster) throw;
        // only upgradeMaster can finalize
        if (finalizedUpgrade) throw;
        // can't finalize twice

        finalizedUpgrade = true;
        // prevent future upgrades

        upgradeAgent.finalizeUpgrade();
        // call finalize upgrade on new contract
        UpgradeFinalized(msg.sender, upgradeAgent);
    }

    // Crowdfunding:

    // don't just send ether to the contract expecting to get tokens
    function() payable {
        invest(msg.sender);
    }

    // Returns the current rate after adding bonuses for the time period
    function getCurrentRate() constant returns (uint){
        if(now >= preSaleStartTime && now < fundingStartTime + 1 weeks) {
            return safeDiv(safeMul(baseTokensPerEther, 120), 100);
        } else if(now >= fundingStartTime + 1 weeks && now < fundingStartTime + 2 weeks) {
            return safeDiv(safeMul(baseTokensPerEther, 110), 100);
        } else if(now >= fundingStartTime + 2 weeks && now < fundingStartTime + 3 weeks) {
            return safeDiv(safeMul(baseTokensPerEther, 105), 100);
        } else if(now >= fundingStartTime + 3 weeks && now < fundingEndTime) {
            return baseTokensPerEther;
        }
    }

    // Allows the owner to add an address to the pre-sale whitelist.
    function addToPreSaleWhitelist(address _address) onlyTeam {
        // Address already added to whitelist.
        if (preSaleAllowed[_address]) throw;

        preSaleWhitelist.push(_address);
        preSaleAllowed[_address] = true;
    }

    /// @notice Create tokens when funding is active.
    /// @dev Required state: Funding
    /// @dev State transition: -> Funding Success (only if cap reached)
    function invest(address _address) payable {

        // Abort if not in Funding or PreSale state.
        if (getState() != State.Funding && getState() != State.PreSale) throw;

        // User hasn't been whitelisted for pre-sale
        if(getState() == State.PreSale && !preSaleAllowed[msg.sender]) throw;

        // Do not allow creating 0 or more than the cap tokens.
        if (msg.value == 0) throw;

        // multiply by exchange rate to get newly created token amount
        uint256 createdTokens = safeMul(msg.value, getCurrentRate());

        allocateTokens(_address, createdTokens);
    }

    // Allows the robot to allocate tokens for an address that purchased DBETs using alternate cryptos
    // using the ICO dashboard after receiving a callback from the payment processor.
    function investOnBehalf(address _address, uint amount, string txHash) onlyRobot {
        if(_address == 0) throw;
        if(amount == 0) throw;

        // Abort if not in Funding or PreSale state.
        if (getState() != State.Funding && getState() != State.PreSale) throw;

        // User hasn't been whitelisted for pre-sale.
        if(getState() == State.PreSale && !preSaleAllowed[_address]) throw;

        allocateTokens(_address, amount);

        InvestedOnBehalfOf(_address, amount, txHash);
    }

    // Allocates tokens to an investors' address
    function allocateTokens(address _address, uint amount) internal {

        // we are creating tokens, so increase the totalSupply
        totalSupply = safeAdd(totalSupply, amount);

        // don't go over the limit!
        if (totalSupply > tokenCreationMax) throw;

        // Assign new tokens to the sender
        balances[_address] = safeAdd(balances[_address], amount);

        // Log token creation event
        Transfer(0, _address, amount);
    }

    // Allows the team to replace the robot address in case something goes wrong.
    function setRobot(address _robot) onlyTeam {
        robot = _robot;
    }

    /// @notice Finalize crowdfunding
    /// @dev If cap was reached or crowdfunding has ended then:
    /// create DBET for the DecentBet Multisig and developer,
    /// transfer ETH to the DecentBet Multisig address.
    /// @dev Required state: Success
    function finalizeCrowdfunding() external {
        // Abort if not in Funding Success state.
        if (getState() != State.Success) throw;
        // don't finalize unless we won
        if (finalizedCrowdfunding) throw;
        // can't finalize twice (so sneaky!)

        // prevent more creation of tokens
        finalizedCrowdfunding = true;

        // Add house fund tokens
        // totalSupply = totalSupply + houseFundTokens
        totalSupply = safeDiv(safeMul(totalSupply, hundredPercent), safeSub(hundredPercent, housePercentOfTotal));

        // Now that house fund tokens are added, just take percentages from totalSupply
        // Founder's supply : 18% of total goes to vault, time locked for 6 months
        uint256 vaultTokens = safeDiv(safeMul(totalSupply, vaultPercentOfTotal), hundredPercent);
        balances[timeVault] = safeAdd(balances[timeVault], vaultTokens);
        Transfer(0, timeVault, vaultTokens);

        // Bounties: 2% of total goes to Decent bet for bounties
        uint256 bountyTokens = safeDiv(safeMul(totalSupply, bountyPercentOfTotal), hundredPercent);

        balances[decentBetMultisig] = safeAdd(balances[decentBetMultisig], bountyTokens);
        Transfer(0, decentBetMultisig, bountyTokens);

        // Transfer ETH to the DBET Multisig address.
        if (!decentBetMultisig.send(this.balance)) throw;
    }

    // Interface marker
    function isDecentBetCrowdsale() returns (bool) {
        return true;
    }

    /// @notice This manages the crowdfunding state machine
    /// We make it a function and do not assign the result to a variable
    /// So there is no chance of the variable being stale
    function getState() public constant returns (State){
        if (block.timestamp < preSaleStartTime) return State.Waiting;
        else if(block.timestamp >= preSaleStartTime &&
                block.timestamp < fundingStartTime &&
                totalSupply < tokenCreationMax) return State.PreSale;
        else if (block.timestamp >= fundingStartTime &&
                block.timestamp < fundingEndTime &&
                totalSupply < tokenCreationMax) return State.Funding;
        else if (block.timestamp >= fundingEndTime ||
                totalSupply == tokenCreationMax) return State.Success;
    }

}