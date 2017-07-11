pragma solidity ^0.4.8;


contract AbstractHouse {

    function authorized(address _address) returns (bool) {}
    function transferWinnings(address winner, uint amount) returns (bool) {}

}
