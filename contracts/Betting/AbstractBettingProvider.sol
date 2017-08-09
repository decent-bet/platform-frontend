pragma solidity ^0.4.0;

contract AbstractBettingProvider {

    function updateGameOutcome(bytes32 id, uint period, int result, uint team1Points, uint team2Points) returns (bool);

}