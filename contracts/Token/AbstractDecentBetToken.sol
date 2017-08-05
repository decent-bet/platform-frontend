pragma solidity ^0.4.8;


contract AbstractDecentBetToken {

    function balanceOf(address who) returns (uint) {}

    function transfer(address to, uint256 value) returns (bool) {}

    function transferFrom(address from, address to, uint256 value) returns (bool) {}

    function approve(address spender, uint256 value) returns (bool) {}

    function allowance(address owner, address spender) returns (uint) {}

}
