pragma solidity ^0.4.8;

// Decent.bet Token only for testing purposes

import './ERC20.sol';
import '../Libraries/SafeMath.sol';
import '../Libraries/TimeProvider.sol';
import './MultiSigWallet.sol';

contract TestUpgradeAgent is SafeMath {
    address public owner;

    bool public isUpgradeAgent;

    function upgradeFrom(address _from, uint256 _value) public;

    function finalizeUpgrade() public;

    function setOriginalSupply() public;
}

/// @title Time-locked vault of tokens allocated to DecentBet after 180 days
contract TestDecentBetVault is SafeMath, TimeProvider {

    // flag to determine if address is for a real contract or not
    bool public isDecentBetVault = false;

    TestDecentBetToken decentBetToken;

    address decentBetMultisig;

    uint256 unlockedAtTime;

    // smaller lock for testing
    uint256 public constant timeOffset = 1 years;

    /// @notice Constructor function sets the DecentBet Multisig address and
    /// total number of locked tokens to transfer
    function TestDecentBetVault(address _decentBetMultisig) /** internal */ {
        if (_decentBetMultisig == 0x0) throw;
        decentBetToken = TestDecentBetToken(msg.sender);
        decentBetMultisig = _decentBetMultisig;
        isDecentBetVault = true;

        // If on local testRPC/testnet and need mock times
        isMock = true;
        setTimeController(msg.sender);

        unlockedAtTime = safeAdd(getTime(), timeOffset);
        // 1 year later
    }

    /// @notice Transfer locked tokens to Decent.bet's multisig wallet
    function unlock() external {
        // Wait your turn!
        if (getTime() < unlockedAtTime) throw;
        // Will fail if allocation (and therefore toTransfer) is 0.
        if (!decentBetToken.transfer(decentBetMultisig, decentBetToken.balanceOf(this))) throw;
        // Otherwise ether are trapped here, we could disallow payable instead...
        if (!decentBetMultisig.send(this.balance)) throw;
    }

    // disallow ETH payments to TimeVault
    function() payable {
        throw;
    }

}


/// @title DecentBet crowdsale contract
contract TestDecentBetToken is SafeMath, ERC20, TimeProvider {

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
    address public owner;
    address public team;

    // Upgrade information
    bool public finalizedUpgrade = false;

    address public upgradeMaster;

    TestUpgradeAgent public upgradeAgent;

    uint256 public totalUpgraded;

    // DBET:ETH exchange rate - Needs to be updated at time of ICO. Price of ETH/0.125.
    // For example: If ETH/USD = 300, it would be 2400 DBETs per ETH.
    uint256 public baseTokensPerEther;
    uint256 public tokenCreationMax = safeMul(250000 ether, 1000);

    // for testing on testnet
    //uint256 public constant tokenCreationMax = safeMul(10 ether, baseTokensPerEther);
    //uint256 public constant tokenCreationMin = safeMul(3 ether, baseTokensPerEther);

    address public decentBetMultisig;

    TestDecentBetVault public timeVault; // DecentBet's time-locked vault

    event Upgrade(address indexed _from, address indexed _to, uint256 _value);

    event Refund(address indexed _from, uint256 _value);

    event UpgradeFinalized(address sender, address upgradeAgent);

    event UpgradeAgentSet(address agent);

    event InvestedOnBehalfOf(address investor, uint amount, string txHash);

    // Allow only the team address to continue
    modifier onlyTeam() {
        if(msg.sender != team) throw;
        _;
    }

    function TestDecentBetToken(address _decentBetMultisig,
    address _upgradeMaster, address _team,
    uint256 _baseTokensPerEther, uint256 _fundingStartTime,
    uint256 _fundingEndTime) {

        if (_decentBetMultisig == 0) throw;
        if (_team == 0) throw;
        if (_upgradeMaster == 0) throw;
        if (_baseTokensPerEther == 0) throw;

        // If on local testRPC/testnet and need mock times
        isMock = true;
        setTimeController(msg.sender);

        // Crowdsale can only officially start after the current block timestamp.
        if (_fundingStartTime <= getTime()) throw;
        if (_fundingEndTime <= _fundingStartTime) throw;

        isDecentBetToken = true;

        upgradeMaster = _upgradeMaster;
        team = _team;
        owner = msg.sender;

        baseTokensPerEther = _baseTokensPerEther;

        timeVault = new TestDecentBetVault(_decentBetMultisig);
        if (!timeVault.isDecentBetVault()) throw;

        decentBetMultisig = _decentBetMultisig;
        if (!MultiSigWallet(decentBetMultisig).isMultiSigWallet()) throw;
    }

    function faucet() {
        balances[msg.sender] = 10000 ether;
        Transfer(0, msg.sender, 10000 ether);
    }

    function ownerFaucet() {
        if(msg.sender != owner) revert();
        balances[msg.sender] = 100000000 ether;
        Transfer(0, msg.sender, 100000000 ether);
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
        // Abort if not in Success state.
        if (agent == 0x0) throw;
        // don't set agent to nothing
        if (msg.sender != upgradeMaster) throw;
        // Only a master can designate the next agent
        upgradeAgent = TestUpgradeAgent(agent);
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
        // Abort if not in Success state.
        if (master == 0x0) throw;
        if (msg.sender != upgradeMaster) throw;
        // Only a master can designate the next master
        upgradeMaster = master;
    }

    /// @notice finalize the upgrade
    /// @dev Required state: Success
    function finalizeUpgrade() external {
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
        throw;
    }

}