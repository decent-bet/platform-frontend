pragma solidity ^0.4.0;


contract AbstractSlotsHelper {

    function isSlotsHelper() returns (bool);
    function paytable(uint symbol) returns (uint);
    function reels(uint reel, uint index) returns (uint8);
    function convertReelToArray(string reel) returns (uint[5]);
    function getTotalReward(uint betSize, uint[5] reelArray) returns (uint);

}