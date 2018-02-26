pragma solidity ^0.4.0;

contract AbstractHouseLottery {

    function pickWinner(uint session, uint participantCount) payable returns (bool);

    function getWinningLotteryTicket(uint session) returns (uint);

    function isHouseLottery() returns (bool);

}
