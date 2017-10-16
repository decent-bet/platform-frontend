# Setting up a private network

## Motivation

With Web3 1.0 in beta and getting close to a full release, there are a number of reasons
to setting up a private test network over simply using TestRPC for development purposes.

Web3 1.0 events require a WebSocket API from your node for event subscriptions to work.
With TestRPC not offering a WebSocket API just yet, at the moment it's impossible to 
work with Web3 1.0 and consume events. Apart from the above use, there are certain
discrepancies in implementations when working with a real Ethereum network and
a simulation, that's offered by TestRPC.

The simplest and best solution is to simply setup a private Ethereum network on your 
local machine using Geth or Parity. This document illustrates how to go about setting 
up your own local chain and mining nodes for development purposes.

### Instructions

* **Download Geth**
https://geth.ethereum.org/downloads/

* **Create a directory to store private chain data**
    
    The new directory will be used to store all new chain data. 
    ```
        Linux/Windows
        mkdir geth-private
    ```
    
* **Create a genesis.json file**

    Every chain requires a genesis block to start from. Navigate to your chain's directory and
    create a genesis.json file with the following parameters
    ```
    {
        "nonce": "0x0000000000000042",
        "timestamp": "0x00",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "extraData": "0x00",
        "gasLimit": "0x8000000",
        "difficulty": "0x400",
        "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "coinbase": "0x3333333333333333333333333333333333333333",
        "alloc": {
            "<YOUR ADDRESS>": {
              "balance": "200000000000000000000"
            }	
        },
        "config": {
            "chainID"       : <YOUR NETWORK ID>,
            "homesteadBlock": 0,
            "eip155Block"   : 0,
            "eip158Block"   : 0
        }
    }
    ```
    The following fields require some customization depending on your setup.
    
    1. Alloc: Alloc is used to pre-allocated Ether to addresses. You can enter any address for
    which you own private keys to.
    
    2. config.chainID: Due to how geth and web3 works, it requires your chain ID and network ID to 
    be equal or it may lead to errors while deploying contracts, sending transactions etc.

* **Create a directory to store your chain data**

    Storing your chain data in a directory within your newly created directory makes it easier
    to reset your chain in the future by simply deleting and re-creating the directory, which 
    could be made simple with a shell script or batch file.
    
    For the sake of this tutorial, we will name the directory 'ethdata'
    
    ```
    mkdir ethdata
    ```
    
* **Initialize your chain**

    Now that you have everything setup to begin your chain, simply run the following command 
    
    ```
    geth --datadir="ethdata" init genesis.json
    ```
    
    You should see something come up along the lines of this
    
    ```
    TODO
    ```
    
* **Start your chain**

    With your chain initialized, you should now see your _ethdata_ folder populated with
    _geth_ and _keystore_ directories. From your root directory, now run the following
    
    ```
    geth --datadir="ethdata" --networkid 10 --rpc --rpcaddr "localhost" --ws --wsorigins "*" --rpccorsdomain "*" --gasprice "0" --rpcapi "db,eth,net,web3,personal,web3" --wsapi "db,eth,net,web3,personal,web3" --nodiscover console
    ```
    
    The command above requires you to fill in whatever network ID you decide to use which
    must match the chainID you specified in _genesis.json_, for this tutorial we will use 
    a network ID of 10.
    
    **Note that there's currently a [bug with geth/web3 1.0 with higher network IDs](#),
    so make sure you use something low.**
    
    You should now see the Geth Javascript console show up.
    
* **Create an account for mining**

    To make sure your chain is functional, you'll need to run a miner thread to make things
    work. You will need to create a new account for this very purpose
    
    ```
    personal.newAccount('<YOUR PASSWORD>')
    ```
    
    This will create a new account simply for the sake of mining.
    
* **Import and unlock an account that you own**

    To work with MetaMask and Truffle during development, you will need to unlock
    accounts that you hold the private key to.
    
    ```
    personal.importRawKey("<PRIVATE KEY WITHOUT LEADING 0x>", "<YOUR ACCOUNT'S PASSWORD>")
    personal.unlockAccount("<YOUR ADDRESS>", "<YOUR ACCOUNT'S PASSWORD>", 150000)
    ```
    
* **Run a mining thread**
    
    Now with everything setup, simply run
    
    ```
    miner.start(1)
    ```
    
    This will begin a mining thread and mine blocks on your chain.
    
## Setup up additional mining nodes

