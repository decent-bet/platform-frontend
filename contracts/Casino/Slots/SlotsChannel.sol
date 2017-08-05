pragma solidity ^0.4.0;


import '../../Token/AbstractDecentBetToken.sol';
import './AbstractSlotsHelper.sol';
import '../../Libraries/ECVerify.sol';
import '../GameChannelManager.sol';
import '../../Libraries/SafeMath.sol';
import '../../Libraries/strings.sol';
import '../../Libraries/Utils.sol';


// A State channel contract to handle slot games on the Decent.bet platform
contract SlotsChannel is SafeMath, Utils {

    using strings for *;
    using ECVerify for *;

    /* Slot specific */

    // Length of each reel in characters
    uint constant REEL_LENGTH = 21;

    // Number of reels
    uint constant NUMBER_OF_REELS = 5;

    // Number of lines
    uint constant NUMBER_OF_LINES = 5;

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

    /* Variables */

    // Address of the token contract - passed through during contract creation
    address public token;

    // Address of the game channel manager contract - passed through during contract creation
    address public gameChannelManager;

    // Indicates whether the user has deposited tokens and is ready for channel activation
    bool public ready;

    // Indicates whether the channel has been activated
    bool public activated;

    // Indicates whether the channel has finalized before being closed
    bool public finalized;

    // Ending block after channel has finalized
    uint public endBlock;

    // The timelimit for this channel after which channel closes
    uint public endTime;

    // Final hash submitted by the user
    string public finalUserHash;

    // AES-256 encrypted initial number used to generate hashes
    string public initialUserNumber;

    // Amount of DBETs to be deposited by the user
    uint public initialDeposit;

    // Initial house seed hash used to create blended seed
    string public initialHouseSeedHash;

    // Final reel hash submitted by the server
    string public finalReelHash;

    // Final seed hash submitted by the server
    string public finalSeedHash;

    // Nonce at the time of finalize
    uint public finalNonce;

    // Indicates the final turn, whether it is the house or the player
    bool public finalTurn;

    // Tracks player earnings - could be negative
    int public playerEarnings;

    // Time for channel to stay active, after which will be closed
    uint constant public timeToLive = 3 hours;

    /* Contracts */
    AbstractDecentBetToken tokenContract;

    AbstractSlotsHelper slotsHelper;

    GameChannelManager gameChannelManagerContract;

    /* Mappings */

    // Amount of DBETs deposited by user and house
    mapping (address => uint) public deposits;

    // Finalized balances for user and house
    mapping (address => uint) public finalBalances;

    // Addresses of the players involved - false = user, true = house
    mapping (bool => address) public players;

    /* Events */
    event Deposit(string finalUserHash);

    event Activate(string finalSeedHash, string finalReelHash);

    /* Constructor */

    // TODO: Allow only the house to create this channel
    function SlotsChannel(address _player, address _house, address _token, address _slotsHelper,
    address _gameChannelManager, uint _initialDeposit) /* onlyHouse */ {
        players[false] = _player;
        players[true] = _house;
        token = _token;
        gameChannelManager = _gameChannelManager;
        initialDeposit = _initialDeposit;
        deposits[_player] = initialDeposit;
        endTime = safeAdd(now, timeToLive);
        tokenContract = AbstractDecentBetToken(_token);
        slotsHelper = AbstractSlotsHelper(_slotsHelper);
        gameChannelManagerContract = GameChannelManager(_gameChannelManager);
    }

    /* Modifiers */

    // Allows only the house to proceed
    modifier isHouse() {
        if (msg.sender != players[true]) throw;
        _;
    }

    // Allows only the player to proceed
    modifier isPlayer() {
        if (msg.sender != players[false]) throw;
        _;
    }

    // Allows only the house and player to proceed
    modifier isParticipant() {
        if (msg.sender != players[true] && msg.sender != players[false]) throw;
        _;
    }

    // Allows only if the user is ready
    modifier isUserReady() {
        if (ready != true) throw;
        _;
    }

    // Allows only if the user is not ready
    modifier isUserNotReady() {
        if (ready == true) throw;
        _;
    }

    // Allows only if channel has not been activated
    modifier isNotActivated() {
        if (activated == true) throw;
        _;
    }

    /* Functions */

    // User deposits DBETs into contract and saves the AES-256 encrypted string of the initial random numbers
    // used to generate all hashes
    function deposit(string _initialUserNumber, string _finalUserHash) // 584k gas
    isPlayer
    isUserNotReady
    returns (bool) {
        if (strLen(_finalUserHash) != 64) throw;
        if (strLen(_initialUserNumber) != 64) throw;
        if (tokenContract.balanceOf(msg.sender) < deposits[msg.sender]) throw;
        initialUserNumber = _initialUserNumber;
        finalUserHash = _finalUserHash;
        ready = true;
        if (!tokenContract.transferFrom(msg.sender, address(this), initialDeposit)) throw;
        Deposit(_finalUserHash);
        return true;
    }

    // House sends the final reel and seed hashes to activate the channel along with the initial house seed hash
    // to verify the blended seed after a channel is closed
    function activate(string _initialHouseSeedHash, string _finalSeedHash, string _finalReelHash) // 373k gas
    isNotActivated
    isHouse
    isUserReady
    returns (bool) {
        if (tokenContract.balanceOf(msg.sender) < deposits[players[false]]) throw;
        initialHouseSeedHash = _initialHouseSeedHash;
        finalReelHash = _finalReelHash;
        finalSeedHash = _finalSeedHash;
        activated = true;
        if (!tokenContract.transferFrom(msg.sender, address(this), deposits[players[false]])) throw;
        Activate(_finalSeedHash, _finalReelHash);
        return true;
    }

    // Checks the signature of a spin sent and verifies it's validity
    function checkSig(bytes32 hash, bytes sig, bool turn) returns (bool) {
        //        bytes32 hash = sha3(reelHash, reel, reelSeedHash, prevReelSeedHash, userHash, prevUserHash,
        //        nonce, turn, userBalance, houseBalance, betSize);
        //        address player = players[turn];
        return ECVerify.ecverify(hash, sig, players[turn]);
    }

    // Returns the address for a signed spin
    function getSigAddress(bytes32 msg, uint8 v, bytes32 r, bytes32 s) returns (address) {
        return ecrecover(sha3(msg), v, r, s);
    }

    // Verifies last two spins and returns their validity
    function checkPair(Spin curr, Spin prior) private returns (bool) {

        // Verify signatures
        if (!checkSigPrivate(curr)) throw; // 100k gas
        if (!checkSigPrivate(prior)) throw; // 100k gas

        // If Player's turn
        if (curr.turn == false) {

            // Checks if spin hashes are pre-images of previous hashes or are hashes in previous spins
            if (!checkSpinHashes(curr, prior)) throw;
            // 5.6k gas

            // Nonce should be incremented by 1
            if (curr.nonce != prior.nonce + 1) throw;

            // The last reel hash needs to be a hash of the last reel seed, user hash and reel
            // The random numbers don't need to verified on contract, only the reel rewards
            // Random numbers could be verified off-chain using the seed-random library using the
            // below hash as the seed
            if (!compareReelHashes(curr, prior)) throw;
            // 103k gas

            // Bet size can be only upto maximum number of lines
            if (prior.betSize > 5 || prior.betSize == 0) throw;

            // Compute last reel reward and check whether balances in current spin are correct
            uint totalSpinReward = getTotalSpinReward(prior);
            // 700k gas
            if (totalSpinReward > 0) {
                if (!isAccurateBalances(curr, prior, totalSpinReward)) throw;
                // 26k gas
            }
            else {
                // User balance for this spin must be the last user balance - betSize
                if (curr.userBalance != safeSub(prior.userBalance, prior.betSize)) throw;

                // House balance for this spin must be the last house balance + betSize
                if (curr.houseBalance != safeAdd(prior.houseBalance, prior.betSize)) throw;
            }
            return true;
        }
        else {
            // During the house's turn, the spin would have the user hash sent by the player

            // Checks if spin hashes are pre-images of previous hashes or are hashes in previous spins
            if (!checkSpinHashes(curr, prior)) throw;

            //32k gas for all conditions

            // Nonce should be incremented by 1
            if (curr.nonce != prior.nonce + 1) throw;

            // Bet size needs to be determined by the user, not house
            if (curr.betSize != prior.betSize) throw;

            // User balance for this spin must be the last user balance - betSize
            if (curr.userBalance != safeSub(prior.userBalance, prior.betSize)) throw;

            // House balance for this spin must be the last house balance + betSize
            if (curr.houseBalance != safeAdd(prior.houseBalance, prior.betSize)) throw;
            return true;
        }

    }

    // Checks the signature of a spin sent and verifies it's validity
    function checkSigPrivate(Spin s) private returns (bool) {
        bytes32 hash = sha3(s.reelHash, s.reel, s.reelSeedHash, s.prevReelSeedHash, s.userHash, s.prevUserHash,
        uintToString(s.nonce), boolToString(s.turn), uintToString(s.userBalance), uintToString(s.houseBalance),
        uintToString(s.betSize));
        address player = players[s.turn];
        return player == ecrecover(hash, s.v, s.r, s.s);
    }

    function checkSpinHashes(Spin curr, Spin prior) private returns (bool) {
        // During a player's turn, the spin would have the reel hash and
        // seed hash which were sent from the server.

        // Previous reel seed needs to be hash of current reel seed
        if (toBytes32(prior.reelSeedHash, 0) != sha256(curr.prevReelSeedHash)) throw;

        // Current and last spin should report the same reel seed hashes
        if (!strCompare(curr.reelSeedHash, prior.reelSeedHash)) throw;

        // Previous user hash needs to be hash of current user hash
        if (toBytes32(prior.userHash, 0) != sha256(curr.userHash)) throw;

        // Current and last spins should report the same user hashes
        if (!strCompare(curr.userHash, prior.prevUserHash)) throw;
    }

    // Compare reel hashes for spins
    function compareReelHashes(Spin curr, Spin prior) private returns (bool) {
        string memory hashSeed = (prior.reelSeedHash.toSlice()
        .concat(prior.reel.toSlice()));
        return toBytes32(prior.reelHash, 0) == sha256(hashSeed);
    }

    // Check reel array for winning lines (Currently 5 lines)
    function getTotalSpinReward(Spin spin) private returns (uint) {
        uint[5] memory reelArray = slotsHelper.convertReelToArray(spin.reel);
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

        return slotsHelper.getTotalReward(spin.betSize, reelArray);
    }

    // Compares two spins and checks whether balances reflect user winnings
    // Works only for user turns
    function isAccurateBalances(Spin curr, Spin prior, uint totalSpinReward) private returns (bool) {

        // User balance for this spin must be the last user balance + reward
        if (curr.userBalance != safeAdd(prior.userBalance, totalSpinReward)) throw;

        // House balance for this spin must be the last house balance - reward
        if (curr.houseBalance != safeSub(prior.houseBalance, totalSpinReward)) throw;

        return true;
    }

    // Finalizes the channel before closing the channel and allowing participants to transfer DBETs
    function finalize(string _curr, string _prior,
    bytes32 currR, bytes32 currS, bytes32 priorR, bytes32 priorS) isParticipant
    returns (uint) {

        Spin memory curr = convertSpin(_curr);
        // 5.6k gas
        curr.r = currR;
        curr.s = currS;

        Spin memory prior = convertSpin(_prior);
        // 5.6k gas
        prior.r = priorR;
        prior.s = priorS;

        uint totalSpinReward = getTotalSpinReward(prior);
//         700k gas
//        if (totalSpinReward > 0) {
//            if (!isAccurateBalances(curr, prior, totalSpinReward)) throw;
//            // 26k gas
//        } else {
//            // User balance for this spin must be the last user balance - betSize
//            if (curr.userBalance != safeSub(prior.userBalance, prior.betSize)) throw;
//
//            // House balance for this spin must be the last house balance + betSize
//            if (curr.houseBalance != safeAdd(prior.houseBalance, prior.betSize)) throw;
//        }
        return totalSpinReward;
//        if (!checkPair(curr, prior)) throw;
        // 1238k gas
        //if (!finalized || curr.nonce > finalNonce) setFinal(curr); // 86k gas
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
    function setFinal(Spin spin) private {
        address user = players[false];
        address house = players[true];
        finalBalances[user] = spin.userBalance;
        finalBalances[house] = spin.houseBalance;
        finalNonce = spin.nonce;
        finalTurn = spin.turn;
        endBlock = block.number + 1 hours;
        gameChannelManagerContract.closeChannel(address(this));
        if (!finalized) finalized = true;
    }

    // Allows player/house to claim DBETs after the channel has closed
    function claim() isParticipant {
        if (isChannelClosed()) {
            uint256 amount = finalBalances[msg.sender];
            if (amount > 0) {
                finalBalances[msg.sender] = 0;
                if (!msg.sender.call.value(amount)()) throw;
            }
        }
    }

    // Utility function to check whether the channel has closed
    function isChannelClosed() private returns (bool) {
        return finalized && block.number > endBlock;
    }

}