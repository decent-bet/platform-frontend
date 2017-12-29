pragma solidity ^0.4.0;


import './SlotsImplementation.sol';
import './AbstractSlotsChannelManager.sol';
import './AbstractSlotsHelper.sol';

import '../../Libraries/SafeMath.sol';
import '../../Libraries/strings.sol';
import '../../Libraries/Utils.sol';

// Since the finalize function call requires a lot of gas and makes SlotsChannelManager
// undeployable due to an OOG exception, we move it into a separate contract.
contract SlotsChannelFinalizer is SlotsImplementation, SafeMath, Utils {

    address public owner;

    // Length of each reel in characters
    uint constant REEL_LENGTH = 21;

    // Number of reels
    uint constant NUMBER_OF_REELS = 5;

    // Number of lines
    uint constant NUMBER_OF_LINES = 5;

    AbstractSlotsChannelManager slotsChannelManager;
    AbstractSlotsHelper slotsHelper;

    modifier onlyOwner() {
        if(msg.sender != owner) revert();
        _;
    }

    modifier isSlotsChannelManagerSet() {
        if(address(slotsChannelManager) == 0x0) revert();
        _;
    }

    function SlotsChannelFinalizer(address _slotsHelper) {
        owner = msg.sender;
        slotsHelper = AbstractSlotsHelper(_slotsHelper);
    }

    function setSlotsChannelManager(address _slotsChannelManager) onlyOwner {
        slotsChannelManager = AbstractSlotsChannelManager(_slotsChannelManager);
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

    // Checks the signature of a spin sent and verifies it's validity
    function checkSigPrivate(uint id, Spin s) private returns (bool) {
        bytes32 hash = sha3(s.reelHash, s.reel, s.reelSeedHash, s.prevReelSeedHash, s.userHash, s.prevUserHash,
        uintToString(s.nonce), boolToString(s.turn), uintToString(s.userBalance), uintToString(s.houseBalance),
        uintToString(s.betSize));
        address player = slotsChannelManager.getPlayer(id, s.turn);
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

    // Compare reel hashes for spins
    function compareReelHashes(Spin curr, Spin prior) private returns (bool) {
        string memory hashSeed = (prior.reelSeedHash.toSlice()
        .concat(prior.reel.toSlice()));
        return toBytes32(prior.reelHash, 0) == sha256(hashSeed);
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

    function finalize(uint id, string _curr, string _prior,
    bytes32 currR, bytes32 currS, bytes32 priorR, bytes32 priorS)
    isSlotsChannelManagerSet returns (bool) {

        if (!slotsChannelManager.isParticipant(id, msg.sender)) revert();

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

        // Finalized
        if (shouldFinalizeChannel(id, curr.nonce))
            slotsChannelManager.setFinal(id, curr.userBalance, curr.houseBalance,
            curr.nonce, curr.turn); // 86k gas

        return true;
    }

    function shouldFinalizeChannel(uint id, uint nonce) private returns (bool) {
        bool finalized;
        uint finalNonce;
        (finalized, finalNonce) = slotsChannelManager.getChannelFinalized(id);
        return (!finalized || nonce > finalNonce);
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

}
