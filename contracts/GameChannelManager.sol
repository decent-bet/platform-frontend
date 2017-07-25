pragma solidity ^0.4.0;


import './AbstractDecentBetToken.sol';
import './SafeMath.sol';
import './SlotsChannel.sol';
import './Utils.sol';


// Decent.bet Game Channel Manager Contract
// Allows users of the platform to create new state channels to play various games against the house
contract GameChannelManager is SafeMath, Utils {

    /* Structs */

    struct Channel {
        address user;
        bool exists;
    }

    /* Variables */
    address public house;

    address public token;

    address public slotsHelper;

    /* Mappings */

    mapping (address => Channel) public channels;

    /* Events */
    event NewChannel(address _address, address user, uint initialDeposit);

    event ChannelClosed(address _address, address user);

    /* Contracts */
    AbstractDecentBetToken tokenContract;

    SlotsChannel slotsContract;

    /* Modifier */
    modifier notHouse() {
        if (msg.sender == house) throw;
        _;
    }

    modifier isHouse() {
        if (msg.sender != house) throw;
        _;
    }

    modifier isBalanceAvailable(uint amount) {
        if (tokenContract.balanceOf(msg.sender) < amount) throw;
        _;
    }

    /* Constructor */
    function GameChannelManager(address _token, address _slotsHelper, address _house) {
        if (_token == 0x0) throw;
        if (_slotsHelper == 0x0) throw;
        if (_house == 0x0) throw;
        token = _token;
        slotsHelper = _slotsHelper;
        house = _house;
        tokenContract = AbstractDecentBetToken(_token);
    }

    // Creates a slots channel
    // Initial user number is the initial 18 digit number which is encrypted using AES-256 with a SHA-3 signed message
    // containing the contract address generated using the user's private key
    // The encrypted initial number is stored only for user reference, if users leave and reopen channels,
    // they should be able to generate hashes again and continue
    function createSlotsChannel(uint initialDeposit)
    notHouse
        //    isBalanceAvailable(initialDeposit)
    returns (address) {
        address slotsChannel = new SlotsChannel(msg.sender, house, token, slotsHelper, address(this), initialDeposit);
        slotsContract = SlotsChannel(slotsChannel);
        channels[slotsChannel] = Channel({user : msg.sender, exists : true});
        NewChannel(slotsChannel, msg.sender, initialDeposit);
        return slotsChannel;
    }

    // Closes an open channel
    function closeChannel(address channel) isHouse returns (bool) {
        if (channels[channel].exists == false) throw;
        channels[channel].exists = false;
        ChannelClosed(channel, channels[channel].user);
        return true;
    }

}
