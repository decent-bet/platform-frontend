pragma solidity ^0.4.0;


contract SlotsImplementation {

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

        // Ending time after channel has finalized
        uint endTime;

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

}
