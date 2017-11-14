pragma solidity ^0.4.0;


import '../../Token/AbstractDecentBetToken.sol';
import '../../House/AbstractHouse.sol';
import './AbstractSlotsHelper.sol';
import '../../Libraries/ECVerify.sol';
import '../../House/HouseOffering.sol';
import '../../Libraries/SafeMath.sol';
import '../../Libraries/strings.sol';
import '../../Libraries/Utils.sol';


// A State channel contract to handle slot games on the Decent.bet platform
contract SlotsChannelManager is HouseOffering, SafeMath, Utils {

    using strings for *;
    using ECVerify for *;

    /* Slot specific */

    // Length of each reel in characters
    uint constant REEL_LENGTH = 21;

    // Number of reels
    uint constant NUMBER_OF_REELS = 5;

    // Number of lines
    uint constant NUMBER_OF_LINES = 5;

    // 100 DBETs minimum deposit. Minimum 20 spins (@ 5 DBETs per spin), Maximum 100 spins (@1 DBET per spin)
    uint constant MIN_DEPOSIT = 100 ether;

    // 1000 DBETs maximum deposit. Minimum 200 spins (@ 5 DBETs per spin), Maximum 1000 spins (@1 DBET per spin)
    uint constant MAX_DEPOSIT = 1000 ether;

    /* END */

    /* Structs */
    struct Spin {

        // Reel hash from this turn
        string reelHash;

        // Reel from this turn
        string reel;

        // Hash of prevReelSeedHash
        string reelSeedHash;

        // Hash to get reelSeedHash
        string prevReelSeedHash;

        // User Submitted Hash
        string userHash;

        // Prev User Submitted Hash
        string prevUserHash;

        // Nonce signifying turn number. Every spin increments nonce by 1.
        uint nonce;

        // Current turn. false = player, true = house
        bool turn;

        // User Balance
        uint userBalance;

        // House Balance
        uint houseBalance;

        // Bet size
        uint betSize;

        // Signature parameters
        uint8 v;
        bytes32 r;
        bytes32 s;

    }

    struct Channel {
        // Indicates whether the user has deposited tokens and is ready for channel activation
        bool ready;

        // Indicates whether the channel has been activated
        bool activated;

        // Indicates whether the channel has finalized before being closed
        bool finalized;

        // Ending block after channel has finalized
        uint endBlock;

        // Final hash submitted by the user
        string finalUserHash;

        // AES-256 encrypted initial number used to generate hashes
        string initialUserNumber;

        // Amount of DBETs to be deposited by the user
        uint initialDeposit;

        // Initial house seed hash used to create blended seed
        string initialHouseSeedHash;

        // Final reel hash submitted by the server
        string finalReelHash;

        // Final seed hash submitted by the server
        string finalSeedHash;

        // Nonce at the time of finalize
        uint finalNonce;

        // Indicates the final turn, whether it is the house or the player
        bool finalTurn;

        // Session number.
        uint session;

        bool exists;
    }

    /* Variables */

    // Address of the house contract - passed through during contract creation
    address public houseAddress;

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

    function SlotsChannelManager(address _house, address _token, address _slotsHelper) /* onlyHouse */ {
        if(_house == 0) throw;
        if(_token == 0) throw;
        if(_slotsHelper == 0) throw;
        houseAddress = _house;
        decentBetToken = AbstractDecentBetToken(_token);
        house = AbstractHouse(_house);
        slotsHelper = AbstractSlotsHelper(_slotsHelper);
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

    // Allows only the house and player to proceed
    modifier isParticipant(uint id) {
        if (!house.authorized(msg.sender) && msg.sender != players[id][false]) throw;
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
            endBlock: 0,
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

    // Helper function to returns channel information for the frontend
    function getChannelInfo(uint id) constant returns (bool, address, bool, bool, uint, bool) {
        return (channels[id].exists,
                players[id][false],
                channels[id].ready,
                channels[id].activated,
                channels[id].initialDeposit,
                channels[id].finalized);
    }

    // Helper function to return hashes used for the frontend/backend
    function getChannelHashes(uint id) constant returns (string, string, string, string, string) {
        return (channels[id].finalUserHash,
                channels[id].initialUserNumber,
                channels[id].initialHouseSeedHash,
                channels[id].finalReelHash,
                channels[id].finalSeedHash);
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
    function transferTokensToChannel(uint id, address _address) internal {
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
    function getSigAddress(bytes32 msg, uint8 v, bytes32 r, bytes32 s) returns (address) {
        return ecrecover(sha3(msg), v, r, s);
    }

    // Verifies last two spins and returns their validity
    function checkPair(Spin curr, Spin prior) private returns (bool) {

        // If Player's turn
        if (curr.turn == false) {

            // The last reel hash needs to be a hash of the last reel seed, user hash and reel
            // The random numbers don't need to verified on contract, only the reel rewards
            // Random numbers could be verified off-chain using the seed-random library using the
            // below hash as the seed
            if (!compareReelHashes(curr, prior)) return false;
            // 103k gas

            // Bet size can be only upto maximum number of lines
            if (prior.betSize > 5 ether || prior.betSize == 0) return false;
            return true;
        }
        else {
            // During the house's turn, the spin would have the user hash sent by the player

            //32k gas for all conditions

            // Bet size needs to be determined by the user, not house
            if (curr.betSize != prior.betSize) return false;
            return true;
        }

    }

    // Checks the signature of a spin sent and verifies it's validity
    function checkSigPrivate(uint id, Spin s) private returns (bool) {
        bytes32 hash = sha3(s.reelHash, s.reel, s.reelSeedHash, s.prevReelSeedHash, s.userHash, s.prevUserHash,
        uintToString(s.nonce), boolToString(s.turn), uintToString(s.userBalance), uintToString(s.houseBalance),
        uintToString(s.betSize));
        address player = players[id][s.turn];
        return player == ecrecover(hash, s.v, s.r, s.s);
    }

    function checkSpinHashes(Spin curr, Spin prior) private returns (bool) {
        // During a player's turn, the spin would have the reel hash and
        // seed hash which were sent from the server.

        // Previous reel seed needs to be hash of current reel seed
        if (toBytes32(prior.reelSeedHash, 0) != sha256(curr.prevReelSeedHash)) return false;

        // Current and last spin should report the same reel seed hashes
        if (!strCompare(curr.reelSeedHash, prior.reelSeedHash)) return false;

        // Previous user hash needs to be hash of current user hash
        if (toBytes32(prior.userHash, 0) != sha256(curr.userHash)) return false;

        // Current and last spins should report the same user hashes
        if (!strCompare(curr.userHash, prior.prevUserHash)) return false;

        return true;
    }

    // Compare reel hashes for spins
    function compareReelHashes(Spin curr, Spin prior) private returns (bool) {
        string memory hashSeed = (prior.reelSeedHash.toSlice()
        .concat(prior.reel.toSlice()));
        return toBytes32(prior.reelHash, 0) == sha256(hashSeed);
    }

    // Check reel array for winning lines (Currently 5 lines)
    function getTotalSpinReward(Spin spin) private returns (uint) {
        uint[5] memory reelArray; //slotsHelper.convertReelToArray(spin.reel);
        //300k gas
        bool isValid = true;

        for (uint8 i = 0; i < NUMBER_OF_REELS; i++) {
            // Reel values can only be between 0 and 20
            if (reelArray[i] > 20) {
                isValid = false;
                break;
            }
        }
        if (isValid == false) throw;

        return 0;//slotsHelper.getTotalReward(spin.betSize, reelArray);
    }

    // Compares two spins and checks whether balances reflect user winnings
    // Works only for user turns
    function isAccurateBalances(Spin curr, Spin prior, uint totalSpinReward) private returns (bool) {

        if(curr.turn) {
            // House turn

            // User balance for this spin must be the last user balance + reward
            if (curr.userBalance != safeSub(safeAdd(prior.userBalance, totalSpinReward), prior.betSize)) return false;

            // House balance for this spin must be the last house balance - reward
            if (curr.houseBalance != safeAdd(safeSub(prior.houseBalance, totalSpinReward), prior.betSize)) return false;
        } else {
            // User turn

            // Both user and house balances should be equal for current and previous spins.
            if(curr.userBalance != prior.userBalance) return false;

            if(curr.houseBalance != prior.houseBalance) return false;
        }

        return true;
    }

    // Finalizes the channel before closing the channel and allowing participants to transfer DBETs
    function finalize(uint id, string _curr, string _prior,
    bytes32 currR, bytes32 currS, bytes32 priorR, bytes32 priorS)
    isParticipant(id)
    constant returns (bool) {

        Spin memory curr = convertSpin(_curr);
        // 5.6k gas
        curr.r = currR;
        curr.s = currS;

        Spin memory prior = convertSpin(_prior);
        // 5.6k gas
        prior.r = priorR;
        prior.s = priorS;

        uint totalSpinReward = getTotalSpinReward(prior);

        if (!isAccurateBalances(curr, prior, totalSpinReward)) return false;

        // 26k gas
        if(!checkSigPrivate(id, curr)) return false;

        if(!checkSigPrivate(id, prior)) return false;

        // Checks if spin hashes are pre-images of previous hashes or are hashes in previous spins
        if (!checkSpinHashes(curr, prior)) return false;

        // 5.6k gas
        if(!checkPair(curr, prior)) return false;

        if (!channels[id].finalized || curr.nonce > channels[id].finalNonce) setFinal(id, curr); // 86k gas

        return true;
    }

    // Convert a bytes32 array to a Spin object
    // Need this to get around 16 local variable function limit
    function convertSpin(string _spin) private returns (Spin) {
        string[14] memory parts = getParts(_spin);
        Spin memory spin = Spin({
            reelHash : parts[0],
            reel : parts[1],
            reelSeedHash : parts[2],
            prevReelSeedHash : parts[3],
            userHash : parts[4],
            prevUserHash : parts[5],
            nonce : parseInt(parts[6]),
            turn : parseBool(parts[7]),
            userBalance : parseInt(parts[8]),
            houseBalance : parseInt(parts[9]),
            betSize : parseInt(parts[10]),
            v : (uint8)(parseInt(parts[11])),
            r : 0,
            s : 0
        });
        return spin;
    }

    function getParts(string _spin) private returns (string[14]) {
        var slice = _spin.toSlice();
        var delimiter = "/".toSlice();
        string[14] memory parts;
        for (uint i = 0; i < parts.length; i++) {
            parts[i] = slice.split(delimiter).toString();
        }
        return parts;
    }

    // Sets the final spin for the channel
    function setFinal(uint id, Spin spin) private {
        address user = players[id][false];
        address house = players[id][true];
        finalBalances[id][user] = spin.userBalance;
        finalBalances[id][house] = spin.houseBalance;
        channels[id].finalNonce = spin.nonce;
        channels[id].finalTurn = spin.turn;
        channels[id].endBlock = block.number + 1 hours;
        if (!channels[id].finalized) channels[id].finalized = true;
        LogChannelFinalized(id, msg.sender);
    }

    // Allows player/house to claim DBETs after the channel has closed
    function claim(uint id) isParticipant(id) {
        address sender = players[id][false] == msg.sender ?
        msg.sender : players[id][true];
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
        return channels[id].finalized && block.number > channels[id].endBlock;
    }

}