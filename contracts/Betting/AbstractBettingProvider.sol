pragma solidity ^0.4.0;

contract AbstractBettingProvider {

    function updateGameOutcome(uint id, uint period, int result, uint team1Points, uint team2Points) returns (bool);

}