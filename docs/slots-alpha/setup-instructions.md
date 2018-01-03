## Decent.bet Slots Alpha Setup Instructions

The decent.bet slots alpha runs on the Rinkeby test network. 
For now, we recommend that you setup your own local geth node to use the platform by following the instructions below

### Setting up a local Rinkeby node

* Follow Step 1 from [these instructions](https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc) to download Geth.

* To run geth with an open RPC api, run the following in your terminal/command line

    ```
    geth --rinkeby --fast --rpc --rpcapi db,eth,net,web3,personal --cache=1024 --rpc --rpcport 8545 --rpccorsdomain "*" --rpcaddr "0.0.0.0"
    ```
    
  If this is your first run, wait for the initial sync to complete. It may take a few hours or more depending on your internet connection.
  
  Also read, [this section](https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc#step-2-run-geth-in-rinkeby-mode) of the previous instructions for security considerations when running a local node.
  
* Once your node has synced, you will need to access it's console by running **geth attach**. 
  You would need to do this in a separate terminal. Run the following command
  
  ```
  geth attach ipc:$HOME/.ethereum/rinkeby/geth.ipc
  ```
  
  You should now see the geth javascript console show up.
    
* Generate private keys from the [Slots Alpha login page](http://slots-alpha.decent.bet/login) by clicking on **Generate Private key**. 
  Save the keys safely and use it solely for testing purposes. 
  Import the keys into your running geth node by running the following commands in the geth console

    ```
    personal.importRawKey("<YOUR GENERATED PRIVATE KEY WITHOUT THE LEADING 0x>","<PASSWORD OF YOUR CHOICE>")
    ```
    
  This step is necessary to use your generated private key to sign/send transactions on the network.    
    
* Copy the address that is displayed in the output of the previous command or alternatively login to the slots alpha and copy the private key's corresponding address by clicking on the address displayed on the top right of the page.
  Use this address to unlock your account on your running Geth node. 
  **Note** This step has to be repeated anytime you restart your local node.
  
    ```
    personal.unlockAccount("<YOUR ADDRESS>", "<PASSWORD USED EARLIER>", 150000)
    ```
   
  You should now be able to send transactions on Rinkeby from your local node using the logged in account.
  
* You will now need Rinkeby ether to send transactions on the network, follow [Step 4 from the previous instructions](https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc#step-4-request-eth) to claim your testnet ether.
    
### Using the Slots Alpha

Once you have your local node setup and imported your private keys/unlocked your accounts, you should be able to login to the platform
and not see a "Not connected" error dialog. To use the slots, you will need to perform the following steps
  
* Claim Faucet
 
  The faucet allows you to set your DBET balance to 10,000 DBETs with the click of a button which allows you to create multiple channels for testing purposes.  
  Simply navigate to the top right of your screen and click on the claim faucet button. If you see an error message, please make sure you've imported/unlocked your 
  logged in account within your local node and have ether in your account balance. 
  You should see your balance update to 10,000 DBETs after the transaction gets confirmed on the network.
  
* Getting slot chips

  Head over to the slots page and click on the **Get Slots Chips** button. Enter the amount of chips you'd like to receive. Make sure that the amount is lesser or equal to
  your current DBET balance. You should see your slots chips update after the transaction gets confirmed on the network.
  
* Creating a channel

  To create a channel, click on the **Crypto Chaos** slot machine and enter the amount of DBETs (Between 100-1000) you'd like to
  initially deposit into the channel. Click on create channel and you should see the game show up under **Available games** after the transaction gets confirmed on the network.
  
* Depositing to a channel

  Once the channel shows up in your available games list, click on the deposit button to deposit your chips to open the channel.
  Once the transaction gets confirmed on the network you should see the status change to **User deposited, waiting for house activation".
  
  
* Playing slots

  Once the house activates the channel, you should see the **Play** button light up. Click on it to begin playing!
  
* Closing a channel

  After you're done playing, you will need to close the channel before claiming your DBETs from the channel. 
  First click the **Close Channel** button and wait for the transaction to get confirmed on the network. You will not be able to 
  spin at this point in time. Once the transaction gets confirmed on the network, you should see the game get hidden and a message 
  displaying "The channel has been finalized. Please wait a minute before the channel closes and claiming your DBETs."
  
* Claiming your DBETs

  You will need to wait a time period of 1 minute on testnet before the channel status switches from finalized to closed. 
  On mainnet this would be a larger time period for security purposes for each channel.
  Once a minute passes after the transaction gets confirmed, you will be able to claim your DBETs from the channel.
  Simply hit refresh and the button should light up, click on it and wait for the transaction to get confirmed on the network.
  To view your updated slot chip balances, head over to the previous slots page and you should see the balances updated based on 
  the closed channel's game.
  