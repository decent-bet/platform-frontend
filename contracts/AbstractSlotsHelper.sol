pragma solidity ^0.4.0;


contract AbstractSlotsHelper {

    function paytable(uint symbol) returns (uint);
    function reels(uint reel, uint index) returns (uint8);
    function convertReelToArray(bytes32 reel) returns (uint[5]);
    function getTotalReward(uint betSize, uint[5] reelArray) returns (uint);

}
