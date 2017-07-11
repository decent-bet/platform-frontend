pragma solidity ^0.4.0;


//
// In Solidity, a mapping is like a hashmap and works with `string` like this:
//   mapping (string => uint) a;
//
// However it doesn't support accessors where string is a key:
//   mapping (string => uint) public a;
//
// "Internal compiler error: Accessors for mapping with dynamically-sized keys not yet implemented."
//
// An accessor returns uint when called as `a(string)`.
//
// As a short term solution, until it is implemented in Solidity, use the conversion code below. It also uses half as much storage space.
//
// See more utilities soon at https://github.com/axic/density
//

library stringaskey {

    function convert(string key) returns (bytes32 ret) {
        if (bytes(key).length > 32) {
            throw;
        }

        assembly {
        ret := mload(add(key, 32))
        }
    }

}