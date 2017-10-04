pragma solidity ^0.4.8;


import './ERC20.sol';
import '../Libraries/SafeMath.sol';
import '../Libraries/TimeProvider.sol';
import './MultiSigWallet.sol';

contract UpgradeAgent is SafeMath {
    address public owner;

    bool public isUpgradeAgent;

    function upgradeFrom(address _from, uint256 _value) public;

    function finalizeUpgrade() public;

    function setOriginalSupply() public;
}

/// @title Time-locked vault of tokens allocated to DecentBet after 365 days
contract DecentBetVault is SafeMath, TimeProvider {

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

        // If on local testRPC/testnet and need mock times
        isMock = true;
        setTimeController(msg.sender);

        // 1 year later
        unlockedAtTime = safeAdd(getTime(), timeOffset);
    }

    /// @notice Transfer locked tokens to Decent.bet's multisig wallet
    function unlock() external {
        // Wait your turn!
        if (getTime() < unlockedAtTime) throw;
        // Will fail if allocation (and therefore toTransfer) is 0.
        if (!decentBetToken.transfer(decentBetMultisig, decentBetToken.balanceOf(this))) throw;
    }

    // disallow ETH payments to TimeVault
    function() payable {
        throw;
    }

}


/// @title DecentBet crowdsale contract
contract DecentBetToken is SafeMath, ERC20, TimeProvider {

    // flag to determine if address is for a real contract or not
    bool public isDecentBetToken = false;

    // State machine
    enum State{Waiting, PreSale, CommunitySale, PublicSale, Success}

    // Token information
    string public constant name = "Decent.Bet Token";

    string public constant symbol = "DBET";

    uint256 public constant decimals = 18;  // decimal places

    uint256 public constant housePercentOfTotal = 10;

    uint256 public constant vaultPercentOfTotal = 18;

    uint256 public constant bountyPercentOfTotal = 2;

    uint256 public constant crowdfundPercentOfTotal = 70;

    uint256 public constant hundredPercent = 100;

    mapping (address => uint256) balances;

    mapping (address => mapping (address => uint256)) allowed;

    // Authorized addresses
    address public team;

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

    // Whitelisted addresses from community
    address[] public communitySaleWhitelist;
    mapping (address => bool) public communitySaleAllowed;
    uint[2] public communitySaleCap = [100000 ether, 200000 ether];
    mapping (address => uint[2]) communitySalePurchases;

    uint256 public preSaleStartTime; // Pre-sale start block timestamp
    uint256 public fundingStartTime; // crowdsale start block timestamp
    uint256 public fundingEndTime; // crowdsale end block timestamp
    // DBET:ETH exchange rate - Needs to be updated at time of ICO.
    // Price of ETH/0.125. For example: If ETH/USD = 300, it would be 2400 DBETs per ETH.
    uint256 public baseTokensPerEther;
    uint256 public tokenCreationMax = safeMul(250000 ether, 1000); // A maximum of 250M DBETs can be minted during ICO.

    // Amount of tokens alloted to pre-sale investors.
    uint256 public preSaleAllotment;
    // Address of pre-sale investors.
    address public preSaleAddress;

    // for testing on testnet
    //uint256 public constant tokenCreationMax = safeMul(10 ether, baseTokensPerEther);
    //uint256 public constant tokenCreationMin = safeMul(3 ether, baseTokensPerEther);

    address public decentBetMultisig;

    DecentBetVault public timeVault; // DecentBet's time-locked vault

    event Upgrade(address indexed _from, address indexed _to, uint256 _value);

    event UpgradeFinalized(address sender, address upgradeAgent);

    event UpgradeAgentSet(address agent);

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

        // If on local testRPC/testnet and need mock times
        isMock = true;
        setTimeController(msg.sender);

        // For testing/dev
//         if(_fundingStartTime == 0) throw;
        // Crowdsale can only officially start during/after the current block timestamp.
        if (_fundingStartTime < getTime()) throw;

        if (_fundingEndTime <= _fundingStartTime) throw;

        isDecentBetToken = true;

        upgradeMaster = _upgradeMaster;
        team = _team;

        baseTokensPerEther = _baseTokensPerEther;

        preSaleStartTime = _fundingStartTime - 1 days;
        fundingStartTime = _fundingStartTime;
        fundingEndTime = _fundingEndTime;

        // Pre-sale issuance from pre-sale contract
        // 0x7be601aab2f40cc23653965749b84e5cb8cfda43
        preSaleAddress = 0x87f7beeda96216ec2a325e417a45ed262495686b;
        preSaleAllotment = 45000000 ether;

        balances[preSaleAddress] = preSaleAllotment;
        totalSupply = safeAdd(totalSupply, preSaleAllotment);

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

    // Allow users to purchase by sending Ether to the contract
    function() payable {
        invest();
    }

    // Updates tokens per ETH rates before the pre-sale
    function updateBaseTokensPerEther(uint _baseTokensPerEther) onlyTeam {
        if(getState() != State.Waiting) throw;

        baseTokensPerEther = _baseTokensPerEther;
    }

    // Returns the current rate after adding bonuses for the time period
    function getTokensAtCurrentRate(uint weiValue) constant returns (uint) {
        /* Pre-sale */
        if(getTime() >= preSaleStartTime && getTime() < fundingStartTime) {
            return safeDiv(safeMul(weiValue, safeMul(baseTokensPerEther, 120)), 100); // 20% bonus
        }

        /* Community sale */
        else if(getTime() >= fundingStartTime && getTime() < fundingStartTime + 1 days) {
            return safeDiv(safeMul(weiValue, safeMul(baseTokensPerEther, 120)), 100); // 20% bonus
        } else if(getTime() >= (fundingStartTime + 1 days) && getTime() < fundingStartTime + 2 days) {
            return safeDiv(safeMul(weiValue, safeMul(baseTokensPerEther, 120)), 100); // 20% bonus
        }

        /* Public sale */
        else if(getTime() >= (fundingStartTime + 2 days) && getTime() < fundingStartTime + 1 weeks) {
            return safeDiv(safeMul(weiValue, safeMul(baseTokensPerEther, 110)), 100); // 10% bonus
        } else if(getTime() >= fundingStartTime + 1 weeks && getTime() < fundingStartTime + 2 weeks) {
            return safeDiv(safeMul(weiValue, safeMul(baseTokensPerEther, 105)), 100); // 5% bonus
        } else if(getTime() >= fundingStartTime + 2 weeks && getTime() < fundingEndTime) {
            return safeMul(weiValue, baseTokensPerEther); // 0% bonus
        }
    }

    // Allows the owner to add an address to the pre-sale whitelist.
    function addToPreSaleWhitelist(address _address) onlyTeam {

        // Add to pre-sale whitelist only if state is Waiting right now.
        if(getState() != State.Waiting) throw;

        // Address already added to whitelist.
        if (preSaleAllowed[_address]) throw;

        preSaleWhitelist.push(_address);
        preSaleAllowed[_address] = true;
    }

    // Allows the owner to add an address to the community whitelist.
    function addToCommunitySaleWhitelist(address[] addresses) onlyTeam {

        // Add to community sale whitelist only if state is Waiting or Presale right now.
        if(getState() != State.Waiting &&
           getState() != State.PreSale) throw;

        for(uint i = 0; i < addresses.length; i++) {
            if(!communitySaleAllowed[addresses[i]]) {
                communitySaleWhitelist.push(addresses[i]);
                communitySaleAllowed[addresses[i]] = true;
            }
        }
    }

    /// @notice Create tokens when funding is active.
    /// @dev Required state: Funding
    /// @dev State transition: -> Funding Success (only if cap reached)
    function invest() payable {

        // Abort if not in PreSale, CommunitySale or PublicSale state.
        if (getState() != State.PreSale &&
            getState() != State.CommunitySale &&
            getState() != State.PublicSale) throw;

        // User hasn't been whitelisted for pre-sale.
        if(getState() == State.PreSale && !preSaleAllowed[msg.sender]) throw;

        // User hasn't been whitelisted for community sale.
        if(getState() == State.CommunitySale && !communitySaleAllowed[msg.sender]) throw;

        // Do not allow creating 0 tokens.
        if (msg.value == 0) throw;

        // multiply by exchange rate to get newly created token amount
        uint256 createdTokens = getTokensAtCurrentRate(msg.value);

        allocateTokens(msg.sender, createdTokens);
    }

    // Allocates tokens to an investors' address
    function allocateTokens(address _address, uint amount) internal {

        // we are creating tokens, so increase the totalSupply.
        totalSupply = safeAdd(totalSupply, amount);

        // don't go over the limit!
        if (totalSupply > tokenCreationMax) throw;

        // Don't allow community whitelisted addresses to purchase more than their cap.
        if(getState() == State.CommunitySale) {
            // Community sale day 1.
            // Whitelisted addresses can purchase a maximum of 100k DBETs (10k USD).
            if(getTime() >= fundingStartTime &&
               getTime() < fundingStartTime + 1 days) {
                if(safeAdd(communitySalePurchases[msg.sender][0], amount) > communitySaleCap[0])
                    throw;
                else
                    communitySalePurchases[msg.sender][0] =
                        safeAdd(communitySalePurchases[msg.sender][0], amount);
            }

            // Community sale day 2.
            // Whitelisted addresses can purchase a maximum of 200k DBETs (20k USD).
            else if(getTime() >= (fundingStartTime + 1 days) &&
                    getTime() < fundingStartTime + 2 days) {
                if(safeAdd(communitySalePurchases[msg.sender][1], amount) > communitySaleCap[1])
                    throw;
                else
                    communitySalePurchases[msg.sender][1] =
                        safeAdd(communitySalePurchases[msg.sender][1], amount);
            }
        }

        // Assign new tokens to the sender.
        balances[_address] = safeAdd(balances[_address], amount);

        // Log token creation event
        Transfer(0, _address, amount);
    }

    /// @notice Finalize crowdfunding
    /// @dev If cap was reached or crowdfunding has ended then:
    /// create DBET for the DecentBet Multisig and team,
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

        // Founder's supply : 18% of total goes to vault, time locked for 6 months
        uint256 vaultTokens = safeDiv(safeMul(totalSupply, vaultPercentOfTotal), crowdfundPercentOfTotal);
        balances[timeVault] = safeAdd(balances[timeVault], vaultTokens);
        Transfer(0, timeVault, vaultTokens);

        // House: 10% of total goes to Decent.bet for initial house setup
        uint256 houseTokens = safeDiv(safeMul(totalSupply, housePercentOfTotal), crowdfundPercentOfTotal);
        balances[timeVault] = safeAdd(balances[decentBetMultisig], houseTokens);
        Transfer(0, decentBetMultisig, houseTokens);

        // Bounties: 2% of total goes to Decent bet for bounties
        uint256 bountyTokens = safeDiv(safeMul(totalSupply, bountyPercentOfTotal), crowdfundPercentOfTotal);
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
        /* Successful if crowdsale was finalized */
        if(finalizedCrowdfunding) return State.Success;

        /* Pre-sale not started */
        else if (getTime() < preSaleStartTime) return State.Waiting;

        /* Pre-sale */
        else if (getTime() >= preSaleStartTime &&
                getTime() < fundingStartTime &&
                totalSupply < tokenCreationMax) return State.PreSale;

        /* Community sale */
        else if (getTime() >= fundingStartTime &&
                getTime() < fundingStartTime + 2 days &&
                totalSupply < tokenCreationMax) return State.CommunitySale;

        /* Public sale */
        else if (getTime() >= (fundingStartTime + 2 days) &&
                 getTime() < fundingEndTime &&
                 totalSupply < tokenCreationMax) return State.PublicSale;

        /* Success */
        else if (getTime() >= fundingEndTime ||
                 totalSupply == tokenCreationMax) return State.Success;
    }

}