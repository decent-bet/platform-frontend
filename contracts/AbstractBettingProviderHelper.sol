pragma solidity ^0.4.11;

contract AbstractBettingProviderHelper {

	function getSpreadOutcome(uint amount, int handicap, uint team1Points, uint team2Points,
							  uint8 choice) returns (uint8);

	function getSpreadReturns(uint amount, int handicap, uint team1Points, uint team2Points,
							  uint8 choice, int odds) returns (uint);

}