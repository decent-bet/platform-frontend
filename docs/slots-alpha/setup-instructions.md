## Decent.bet Slots Alpha Setup Instructions

The decent.bet slots alpha runs on the Rinkeby test network. 
For now, since there aren't any decent options for highly available, secure Websocket enabled Geth nodes - we recommend that you setup your own local geth node using the following instructions.

### Setting up a local Rinkeby node

* Follow Step 1 from [these instructions](https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc) to download Geth.

* To run geth with an open RPC api, run the following in your terminal/command line

    ```
    geth --rinkeby --fast --rpc --rpcapi db,eth,net,web3,personal --ws --wsorigins "*" --wsapi "db,eth,net,web3,personal,web3" --cache=1024 --rpc --rpcport 8545 --rpccorsdomain "*" --rpcaddr "0.0.0.0"
    ```
    
* Generate private keys from the [Slots Alpha login page](http://slots-alpha.decent.bet/login) by clicking on **Generate Private key**. 
  Save the keys safely and use it solely for testing purposes. 
  Import the keys into your running geth node by running the following commands in the geth console

    ```
    personal.importRawKey("<YOUR GENERATED PRIVATE KEY WITHOUT THE LEADING 0x>","<PASSWORD OF YOUR CHOICE>")
    ```
    
  This step is necessary to use your generated private key to sign/send transactions on the network.    
    
* Login to the slots alpha and copy the private key's corresponding address by clicking on the address displayed on the top right of the page.
  Use this address to unlock your account on your running Geth node. 
  **Note** This step has to be repeated anytime you restart your local node.
  
    ```
    personal.unlockAccount("<YOUR ADDRESS>", "<PASSWORD USED EARLIER>", 150000)
    ```
   
* You should now be able to send transactions on Rinkeby from your local node using the logged in account.
    
### Using the Slots Alpha

Once you have your local node setup and imported your private keys/unlocked your accounts, you should be able to login to the platform
and not see a "Not connected" error dialog. To use the slots, you will need to perform the following steps
  
* Claim Faucet
 
  The faucet allows you to set your DBET balance to 10,000 DBETs with the click of a button which allows you to create multiple channels for testing purposes.  
  Simply navigate to the top right of your screen and click on the claim faucet button.