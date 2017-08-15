pragma solidity ^0.4.11;

contract AbstractSportsOracle {

    function addProviderGameToUpdate(uint gameId, uint providerGameId) returns (bool);

    function requestProvider() returns (bool);

}