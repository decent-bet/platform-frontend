pragma solidity ^0.4.8;


contract AbstractHouse {

    function authorized(address _address) returns (bool) {}
    function transferProfits(address winner, uint amount) returns (bool) {}
    function currentSession() returns (uint) {}

}