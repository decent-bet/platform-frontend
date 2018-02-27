pragma solidity ^0.4.0;


import './AbstractHouse.sol';
import './HouseOffering.sol';
import '../Libraries/SafeMath.sol';
import '../Token/AbstractDecentBetToken.sol';
import "../Libraries/oraclizeAPI.sol";

contract HouseLottery is SafeMath, usingOraclize {

    // Variables
    address public owner;
    address public house;

    uint public currentSession;

    // Structs
    struct Lottery {
        // Ticket count for each session.
        uint ticketCount;
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

    event LogWinner(uint session, uint number, uint randomInRange, uint ticketCount);

    event callback(string message);

    event oraclizePricingError(uint price);

    function HouseLottery() {
        owner = msg.sender;
        // TODO: Replace with oraclize address.
        OAR = OraclizeAddrResolverI(0x1ab9be4a13b0039eac53ca515584849d001af069);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    modifier onlyHouse() {
        if (msg.sender != house) throw;
        _;
    }

    // Abstract lottery function
    function isHouseLottery() returns (bool) {
        return true;
    }

    function setHouse(address _house) onlyOwner {
        house = _house;
    }

    function pickWinner(uint session, uint ticketCount) payable
    onlyHouse returns (bool) {
        // Throw if current session is session 0.
        if (session == 0 || session <= currentSession) throw;

        currentSession = session;
        lotteries[currentSession].ticketCount = ticketCount;

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
        uint randomNumber = randomInRange(number, lotteries[currentSession].ticketCount);
        lotteries[currentSession].winningTicket = randomNumber;
        lotteries[currentSession].ended = true;
        LogWinner(currentSession, number, randomNumber, lotteries[currentSession].ticketCount);
    }

    function getWinningLotteryTicket(uint session) returns (uint) {
        if (!lotteries[currentSession].ended) throw;
        return lotteries[currentSession].winningTicket;
    }

    // Number = 7 digit random number from random.org
    // Participants = Number of participants in this session
    function randomInRange(uint number, uint tickets) returns (uint) {
        uint range = 8999999;
        uint numberInRange = safeDiv(safeMul(safeSub(number, 1000000), safeAdd(tickets, 1)), range);
        if (numberInRange > tickets)
            numberInRange = tickets;
        return numberInRange;
    }

    // Do not accept payments in ETH
    function() {
        throw;
    }

}
