pragma solidity ^0.4.0;


import './AbstractHouse.sol';
import './HouseOffering.sol';
import '../Libraries/SafeMath.sol';
import '../Token/AbstractDecentBetToken.sol';
import "../Libraries/oraclizeAPI.sol";

contract HouseLottery is SafeMath, usingOraclize {

    // Variables
    address public house;

    uint currentSession;

    // Structs
    struct Lottery {
        // Participant count for each session.
        uint participantCount;
        // Winning ticket for a session.
        uint winningTicket;
        // True if ended.
        bool ended;
    }

    // Mappings
    // Winners for each session
    mapping (uint => Lottery) public lotteries;

    // IDs generated for RNG during each session.
    mapping (uint => bytes32) public rngIds;

    // Events
    event LogHouseDeposit(uint session, uint amount);

    event LogWinner(uint session, uint number, uint randomInRange, uint participantCount);

    event callback(string message);

    event oraclizePricingError(uint price);

    function HouseLottery() {
        house = msg.sender;
        // TODO: Replace with oraclize address.
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

    modifier onlyHouse() {
        if (msg.sender != house) throw;
        _;
    }

    function pickWinner(uint session, uint participantCount) payable
    onlyHouse returns (bool) {
        // Throw if current session is session 0.
        if (session == 0 || session <= currentSession) throw;

        currentSession = session;
        lotteries[currentSession].participantCount = participantCount;

        // Sufficient ETH needs to be sent with this transaction.
        if (oraclize_getPrice("WolframAlpha") > this.balance) {
            callback("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
            oraclizePricingError(oraclize_getPrice("WolframAlpha"));
        }
        else {
            callback("Oraclize query was sent, standing by for the answer..");
            bytes32 rngId = oraclize_query(
            "WolframAlpha",
            "random number between 1000000 and 9999999");
            rngIds[currentSession] = rngId;
        }

        return true;
    }

    function __callback(bytes32 myid, string _result) {
        callback("callback received");
        if (msg.sender != oraclize_cbAddress()) throw;
        uint number;
        string memory temp = '';
        bytes memory result = bytes(_result);
        // Example _result: [1245343]
        for (uint i = 0; i <= result.length - 1; i++) {
            string memory char = new string(1);
            bytes memory _char = bytes(char);
            _char[0] = result[i];
            temp = strConcat(temp, string(_char));
            if (i == result.length - 1) {
                number = parseInt(string(temp));
            }
        }
        uint randomNumber = randomInRange(number, lotteries[currentSession].participantCount);
        lotteries[currentSession].winningTicket = randomNumber;
        lotteries[currentSession].ended = true;
        LogWinner(currentSession, number, randomNumber, lotteries[currentSession].participantCount);
    }

    function getWinningLotteryTicket(uint session) returns (uint) {
        if (!lotteries[currentSession].ended) throw;
        return lotteries[currentSession].winningTicket;
    }

    // Number = 7 digit random number from random.org
    // Participants = Number of participants in this session
    function randomInRange(uint number, uint participants) returns (uint) {
        uint range = 8999999;
        uint numberInRange = safeDiv(safeMul(safeSub(number, 1000000), safeAdd(participants, 1)), range);
        if (numberInRange > participants)
        numberInRange = participants;
        return numberInRange;
    }

    // Do not accept payments in ETH
    function() {
        throw;
    }

}
