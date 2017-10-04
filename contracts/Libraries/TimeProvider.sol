pragma solidity ^0.4.0;

// Provides time for contracts that can be toggled to a mock time on TestRPC/local networks and the current
// block timestamp on testnet/mainnet.
contract TimeProvider {

    bool isMock;
    uint mockTime = now;
    address public timeController;

    modifier onlyTimeController() {
        if(msg.sender != timeController) throw;
        _;
    }

    function getTime() returns (uint) {
        return isMock ? mockTime : now;
    }

    function setTime(uint time) onlyTimeController {
        mockTime = time;
    }

    function setTimeController(address _timeController) internal {
        timeController = _timeController;
    }

}