pragma solidity ^0.4.11;

contract AbstractSportsOracle {

    function addProviderGameToUpdate(uint gameId, bytes32 providerGameId) returns (bool);

}