pragma solidity ^0.4.0;


import "../../Libraries/SafeMath.sol";
import "../../Token/AbstractDecentBetToken.sol";
import "../../House/AbstractHouse.sol";
import "../../Libraries/oraclizeAPI.sol";


contract Slots is usingOraclize {

    // Contracts
    AbstractDecentBetToken decentBetToken;

    AbstractHouse house;

    // Events
    event newSpins(bytes32 id, string spins, uint r1, uint r2, uint r3);

    event callback(string message);

    // Variables
    address houseAddress;

    string symbolA = "A";

    string symbolB = "B";

    string symbolC = "C";

    string symbolD = "D";

    string symbolE = "E";

    string symbolF = "F";

    string symbolG = "G";

    string reel1 = "CCAEBEACBDCBAABGEDBEF";

    string reel2 = "BGBCCFCACABFDCEECDAFB";

    string reel3 = "DADGBFBAACADAABBADAED";

    uint reelLength = 21;

    string apiKey = "fe0444b0-c884-4663-92fd-4943d173d4a9";

    string public lastSpins;

    mapping (string => uint) paytable;

    bytes32[] public spins;

    mapping (bytes32 => address) userSpins;

    function Slots(address decentBetTokenAddress, address _houseAddress){
        if (decentBetTokenAddress == 0) throw;
        if (_houseAddress == 0) throw;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        houseAddress = _houseAddress;
        decentBetToken = AbstractDecentBetToken(decentBetTokenAddress);
        house = AbstractHouse(houseAddress);
        initPayTables();
    }

    function initPayTables() {
        paytable[symbolA] = 10;
        paytable[symbolB] = 20;
        paytable[symbolC] = 40;
        paytable[symbolD] = 80;
        paytable[symbolE] = 160;
        paytable[symbolF] = 320;
        paytable[symbolG] = 640;
    }

    function __callback(bytes32 myid, string _result) {
        callback("callback received");
        if (msg.sender != oraclize_cbAddress()) throw;
        uint r1 = 99; // Any number above 20
        uint r2 = 99;
        uint r3 = 99;
        string memory temp = '';
        bytes memory result = bytes(_result);
        // Example _result: [12,4,5]
        for (uint i = 1; i <= result.length - 1; i++) {
            if (i == result.length - 1)
                r3 = parseInt(string(temp));
            else {
                if (result[i] != ','){
                    string memory char = new string(1);
                    bytes memory _char = bytes(char);
                    _char[0] = result[i];
                    temp = strConcat(temp, string(_char));
                } else {
                    if(r1 == 99)
                        r1 = parseInt(string(temp));
                    else
                        r2 = parseInt(string(temp));
                    temp = '';
                }
            }
        }
        newSpins(myid, _result, r1, r2, r3);
        lastSpins = _result;
    }

    function spin() payable {
        if (oraclize_getPrice("URL") > this.balance) {
            callback("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            callback("Oraclize query was sent, standing by for the answer..");
            bytes32 spinId = oraclize_query("URL", "json(https://api.random.org/json-rpc/1/invoke).result.random.data", '\n{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"fe0444b0-c884-4663-92fd-4943d173d4a9","n":3,"min":0,"max":20,"replacement":true,"base":10},"id":21644}');
            spins.push(spinId);
            userSpins[spinId] = msg.sender;
        }
    }

    // parseInt
    function parseInt(string _a) internal returns (uint) {
        return parseInt(_a, 0);
    }

    // parseInt(parseFloat*10^_b)
    function parseInt(string _a, uint _b) internal returns (uint) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i=0; i<bresult.length; i++){
            if ((bresult[i] >= 48)&&(bresult[i] <= 57)){
                if (decimals){
                    if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(bresult[i]) - 48;
            } else if (bresult[i] == 46) decimals = true;
        }
        if (_b > 0) mint *= 10**_b;
        return mint;
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal returns (string) {
        return strConcat(_a, _b, "", "", "");
    }

    // Do not accept payments in ETH
    function () {
        throw;
    }


}
