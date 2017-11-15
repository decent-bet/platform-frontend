pragma solidity ^0.4.0;

import './SlotsImplementation.sol';
import './AbstractSlotsHelper.sol';
import '../../Token/AbstractDecentBetToken.sol';
import '../../House/AbstractHouse.sol';
import '../../House/HouseOffering.sol';

import '../../Libraries/ECVerify.sol';
import '../../Libraries/SafeMath.sol';
import '../../Libraries/strings.sol';
import '../../Libraries/Utils.sol';


// A State channel contract to handle slot games on the Decent.bet platform
contract SlotsChannelManager is SlotsImplementation, HouseOffering, SafeMath, Utils {

    using strings for *;
    using ECVerify for *;

    /* Slot specific */

    // 100 DBETs minimum deposit. Minimum 20 spins (@ 5 DBETs per spin), Maximum 100 spins (@1 DBET per spin)
    uint constant MIN_DEPOSIT = 100 ether;

    // 1000 DBETs maximum deposit. Minimum 200 spins (@ 5 DBETs per spin), Maximum 1000 spins (@1 DBET per spin)
    uint constant MAX_DEPOSIT = 1000 ether;

    /* END */

    /* Variables */

    // Address of the house contract - passed through during contract creation
    address public houseAddress;

    // Address of the slots channel finalizer contract - passed through during contract creation
    address public slotsChannelFinalizer;

    // Used to create incremented channel ids.
    uint public channelCount;

    // Current house session.
    uint public currentSession;

    // Time for channel to stay active, after which will be closed
    uint constant public timeToLive = 3 hours;

    /* Contracts */
    AbstractDecentBetToken decentBetToken;

    AbstractHouse house;

    AbstractSlotsHelper slotsHelper;

    /* Mappings */

    // Channels created.
    mapping (uint => Channel) channels;

    // Amount of DBETs deposited by user and house for a channel.
    mapping (uint => mapping(address => uint)) public channelDeposits;

    // Finalized balances for user and house for a channel.
    mapping (uint => mapping(address => uint)) public finalBalances;

    // Addresses of the players involved - false = user, true = house for a channel.
    mapping (uint => mapping(bool => address)) public players;

    // Users need to deposit/withdraw tokens for a session with the provider before placing bets.
    // These can be withdrawn at any time.
    // mapping (userAddress => mapping (sessionNumber => amount))
    mapping (address => mapping (uint => uint)) public depositedTokens;

    /* Events */
    event LogNewChannel(uint id, address user, uint initialDeposit);

    event LogChannelFinalized(uint id, address user);

    event LogChannelDeposit(uint id, address user, string finalUserHash);

    event LogChannelActivate(uint id, address user, string finalSeedHash, string finalReelHash);

    event LogDeposit(address _address, uint amount, uint session, uint balance);

    event LogWithdraw(address _address, uint amount, uint session, uint balance);

    /* Constructor */

    function SlotsChannelManager(address _house, address _token, address _slotsHelper,
                                 address _slotsChannelFinalizer) /* onlyHouse */ {
        if(_house == 0) throw;
        if(_token == 0) throw;
        if(_slotsHelper == 0) throw;
        if(_slotsChannelFinalizer == 0) throw;
        houseAddress = _house;
        decentBetToken = AbstractDecentBetToken(_token);
        house = AbstractHouse(_house);
        slotsHelper = AbstractSlotsHelper(_slotsHelper);
        slotsChannelFinalizer = _slotsChannelFinalizer;
        if(!slotsHelper.isSlotsHelper()) throw;
        name = 'Slots Channel Manager';
        isHouseOffering = true;
    }

    /* Modifiers */

    modifier onlyHouse() {
        if (msg.sender != houseAddress) throw;
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

    // Allows functions to execute only if the session is prior or equal to current house session
    // and if session is not 0.
    modifier isValidPriorSession(uint session) {
        if(session > currentSession || session == 0) throw;
        _;
    }

    // Allows functions to execute only if users have "amount" tokens in their depositedTokens balance.
    modifier isTokensAvailable(uint amount) {
        if (depositedTokens[msg.sender][currentSession] < amount) throw;
        _;
    }

    // Allows only the house to proceed
    modifier isHouse(uint id) {
        if (msg.sender != players[id][true]) throw;
        _;
    }

    // Allows only the player to proceed
    modifier isPlayer(uint id) {
        if (msg.sender != players[id][false]) throw;
        _;
    }

    // Allows only if the user is ready
    modifier isUserReady(uint id) {
        if (channels[id].ready != true) throw;
        _;
    }

    // Allows only if the user is not ready
    modifier isUserNotReady(uint id) {
        if (channels[id].ready == true) throw;
        _;
    }

    // Allows only if channel has not been activated
    modifier isNotActivated(uint id) {
        if (channels[id].activated == true) throw;
        _;
    }

    /* Functions */
    function createChannel(uint initialDeposit) {
        // Deposit in DBETs. Use ether since 1 DBET = 18 Decimals i.e same as ether decimals.
        if(initialDeposit < MIN_DEPOSIT || initialDeposit > MAX_DEPOSIT)
        throw;
            channels[channelCount] = Channel({
            ready: false,
            activated: false,
            finalized: false,
            endTime: 0,
            finalUserHash: '',
            initialUserNumber: '',
            initialDeposit: initialDeposit,
            initialHouseSeedHash: '',
            finalReelHash: '',
            finalSeedHash: '',
            finalNonce: 0,
            finalTurn: false,
            session: currentSession,
            exists: true
        });
        players[channelCount][false] = msg.sender;
        LogNewChannel(channelCount, msg.sender, initialDeposit);
        channelCount++;
    }

    // Helper function to return channel information for the frontend
    function getChannelInfo(uint id) constant returns (address, bool, bool, uint) {
        return (players[id][false],
                channels[id].ready,
                channels[id].activated,
                channels[id].initialDeposit);
    }

    // Helper function to return hashes used for the frontend/backend
    function getChannelHashes(uint id) constant returns (string, string, string, string, string) {
        return (channels[id].finalUserHash,
                channels[id].initialUserNumber,
                channels[id].initialHouseSeedHash,
                channels[id].finalReelHash,
                channels[id].finalSeedHash);
    }

    // Helper function to return whether a channel has been finalized and it's final nonce
    function getChannelFinalized(uint id) constant returns (bool, uint) {
        return (channels[id].finalized, channels[id].finalNonce);
    }

    function getPlayer(uint id, bool isHouse) constant returns (address){
        return players[id][isHouse];
    }

    // Allows the house to add funds to the provider for this session or the next.
    function houseDeposit(uint amount, uint session)
    onlyHouse
    returns (bool) {
        // House deposits are allowed only for this session or the next.
        if(session != currentSession && session != currentSession + 1) return false;

        // Record the total number of tokens deposited into the house.
        depositedTokens[houseAddress][session] = safeAdd(depositedTokens[houseAddress][session], amount);

        // Transfer tokens from house to betting provider.
        if(!decentBetToken.transferFrom(msg.sender, address(this), amount)) return false;

        LogDeposit(houseAddress, amount, session, depositedTokens[houseAddress][session]);
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
        depositedTokens[msg.sender][currentSession] =
        safeAdd(depositedTokens[msg.sender][currentSession], amount);
        if(!decentBetToken.transferFrom(msg.sender, address(this), amount)) return false;
        LogDeposit(msg.sender, amount, currentSession, depositedTokens[msg.sender][currentSession]);
        return true;
    }

    // Withdraw DBETS from contract to sender address.
    function withdraw(uint amount, uint session)
    isValidPriorSession(session)
    isTokensAvailable(amount) returns (bool) {
        depositedTokens[msg.sender][session] = safeSub(depositedTokens[msg.sender][session], amount);
        if(!decentBetToken.transfer(msg.sender, amount)) return false;
        LogWithdraw(msg.sender, amount, session, depositedTokens[msg.sender][session]);
        return true;
    }

    // Query balance of deposited tokens for a user.
    function balanceOf(address _address, uint session) constant returns (uint) {
        return depositedTokens[_address][session];
    }

    function setSession(uint session)
        // Replace other functions with onlyAuthorized
        onlyHouse returns (bool) {
        currentSession = session;
        return true;
    }

    // User deposits DBETs into contract and saves the AES-256 encrypted string of the initial random numbers
    // used to generate all hashes
    function depositChannel(uint id, string _initialUserNumber, string _finalUserHash) // 584k gas
    isPlayer(id)
    isUserNotReady(id)
    returns (bool) {
        if (strLen(_finalUserHash) != 64) throw;
        if (strLen(_initialUserNumber) != 64) throw;
        if (balanceOf(msg.sender, channels[id].session) < channels[id].initialDeposit) throw;
        channels[id].initialUserNumber = _initialUserNumber;
        channels[id].finalUserHash = _finalUserHash;
        channels[id].ready = true;
        transferTokensToChannel(id, msg.sender);
        LogChannelDeposit(id, players[id][true], _finalUserHash);
        return true;
    }

    // Allows users to remove their deposit from a channel IF the channel hasn't
    // been activated yet and the user is ready.
    function withdrawChannelDeposit(uint id)
    isPlayer(id)
    isUserReady(id)
    isNotActivated(id) {
        uint deposit = channelDeposits[id][msg.sender];
        channelDeposits[id][msg.sender] = 0;
        depositedTokens[msg.sender][channels[id].session] =
        safeAdd(depositedTokens[msg.sender][channels[id].session], channels[id].initialDeposit);
    }

    // House sends the final reel and seed hashes to activate the channel along with the initial house seed hash
    // to verify the blended seed after a channel is closed
    function activateChannel(uint id, string _initialHouseSeedHash,
    string _finalSeedHash, string _finalReelHash) // 373k gas
    onlyAuthorized
    isNotActivated(id)
    isUserReady(id)
    returns (bool) {
        // The house will be unable to activate a channel IF it doesn't have enough tokens
        // in it's balance - which could happen organically or at the end of a session.
        if (balanceOf(houseAddress, channels[id].session) < channels[id].initialDeposit) throw;
        channels[id].initialHouseSeedHash = _initialHouseSeedHash;
        channels[id].finalReelHash = _finalReelHash;
        channels[id].finalSeedHash = _finalSeedHash;
        channels[id].activated = true;
        players[id][true] = msg.sender;
        transferTokensToChannel(id, houseAddress);
        LogChannelActivate(id, players[id][true], _finalSeedHash, _finalReelHash);
        return true;
    }

    // Transfers tokens to a channel.
    function transferTokensToChannel(uint id, address _address) private {
        channelDeposits[id][_address] =
        safeAdd(channelDeposits[id][_address], channels[id].initialDeposit);
        depositedTokens[_address][channels[id].session] =
        safeSub(depositedTokens[_address][channels[id].session], channels[id].initialDeposit);
    }

    // Checks the signature of a spin sent and verifies it's validity
    function checkSig(uint id, bytes32 hash, bytes sig, bool turn) constant returns (bool) {
        //        bytes32 hash = sha3(reelHash, reel, reelSeedHash, prevReelSeedHash, userHash, prevUserHash,
        //        nonce, turn, userBalance, houseBalance, betSize);
        //        address player = players[turn];
        return ECVerify.ecverify(hash, sig, players[id][turn]);
    }

    // Returns the address for a signed spin
    function getSigAddress(bytes32 msg, uint8 v, bytes32 r, bytes32 s) constant returns (address) {
        return ecrecover(sha3(msg), v, r, s);
    }

    // Allows only the house and player to proceed
    function isParticipant(uint id, address _address) internal returns (bool) {
        return (!house.authorized(msg.sender) && msg.sender != players[id][false]);
    }

    // Sets the final spin for the channel
    function setFinal(uint id, uint userBalance, uint houseBalance, uint nonce, bool turn) external {
        if(msg.sender != slotsChannelFinalizer) revert();

        address user = players[id][false];
        address house = players[id][true];
        finalBalances[id][user] = userBalance;
        finalBalances[id][house] = houseBalance;
        channels[id].finalNonce = nonce;
        channels[id].finalTurn = turn;
        channels[id].endTime = block.timestamp + 1 hours;
        if (!channels[id].finalized) channels[id].finalized = true;
        LogChannelFinalized(id, players[id][turn]);
    }

    // Allows player/house to claim DBETs after the channel has closed
    function claim(uint id) {
        if(!isParticipant(id, msg.sender)) revert();

        address sender = players[id][false] == msg.sender ? msg.sender : players[id][true];

        if (isChannelClosed(id)) {
            uint256 amount = finalBalances[id][sender];
            if (amount > 0) {
                finalBalances[id][sender] = 0;
                channelDeposits[id][sender] = 0;
                depositedTokens[sender][channels[id].session] =
                safeAdd(depositedTokens[sender][channels[id].session], amount);
            }
        }
    }

    // Utility function to check whether the channel has closed
    function isChannelClosed(uint id) private returns (bool) {
        return channels[id].finalized && block.timestamp > channels[id].endTime;
    }

}