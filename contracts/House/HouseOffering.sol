pragma solidity ^0.4.0;

// HouseOffering interface, allowing games/sports betting contracts etc. to be added to the house and
// essentially allow the house to deposit/withdraw for sessions.

contract HouseOffering {

    bytes32 public name;
    // For validating whether a contract is a house offering from the house contract.
    bool public isHouseOffering;
    function houseDeposit(uint amount, uint session) returns (bool);
    function withdrawPreviousSessionTokens() returns (bool);
    function deposit(uint amount) returns (bool);
    function withdraw(uint amount, uint session) returns (bool);
    function balanceOf(address _address, uint session) constant returns (uint);
    function setSession(uint session) returns (bool);

}
