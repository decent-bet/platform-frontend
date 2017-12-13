# Setting up a private network

## Motivation

Apart from testing contracts in a real network environment which doesn't serve
only as a simulation like TestRPC does, with Web3 1.0 in beta and getting close 
to a full release, there are a number of reasons to setting up a private 
test network over simply using TestRPC for development purposes.

Web3 1.0 events require a WebSocket API from your node for event subscriptions to work.
With TestRPC not offering a WebSocket API just yet, at the moment it's impossible to 
work with Web3 1.0 and consume events. Apart from the above use, there are certain
discrepancies in implementations when working with a real Ethereum network and
a simulation, that's offered by TestRPC.

The simplest and best solution is to simply setup a private Ethereum network on your 
local machine using Geth or Parity. This document illustrates how to go about setting 
up your own local chain and mining nodes for development purposes.

### Instructions

1. **Download Geth**
https://geth.ethereum.org/downloads/

2. **Create a directory to store private chain data**
    
    The new directory will be used to store all new chain data. 
    
    ```
        mkdir geth-private
    ```
    
3. **Create a genesis.json file**

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
    
    1. Alloc: Alloc is used to pre-allocate Ether to addresses. You can enter any address for
    which you own private keys to.
    
    2. config.chainID: Due to how geth and web3 works, it requires your chain ID and network ID to 
    be equal or it may lead to errors while deploying contracts, sending transactions etc.

4. **Create a directory to store your chain data**

    Storing your chain data in a directory within your newly created directory makes it easier
    to reset your chain in the future by simply deleting and re-creating the directory, which 
    could be made simple with a shell script or batch file.
    
    For the sake of this tutorial, we will name the directory 'ethdata'
    
    ```
    mkdir ethdata
    ```
    
5. **Initialize your chain**

    Now that you have everything setup to begin your chain, simply run the following command 
    
    ```
    geth --datadir="ethdata" init genesis.json
    ```
    
    You should see output along the lines of this
    
    ```
    INFO [10-20|21:00:32] Starting P2P networking
    INFO [10-20|21:00:32] RLPx listener up                         self="enode://d6c
    bf22b62f71431b42591bb802e68740c4fc2c1840943ee5901bf427b1e8bb8099cfee694875794aa8
    53ffe53dad87ffc2c0aee1642c5c0e95b58f585cab581@[::]:30303?discport=0"
    INFO [10-20|21:00:32] IPC endpoint opened: \\.\pipe\geth.ipc
    INFO [10-20|21:00:32] HTTP endpoint opened: http://localhost:8545
    INFO [10-20|21:00:32] WebSocket endpoint opened: ws://127.0.0.1:8546
    Welcome to the Geth JavaScript console!
    >
    ```
    
6. **Start your chain**

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
    
7. **Create an account for mining**

    To make sure your chain is functional, you'll need to run a miner thread to make things
    work. You will need to create a new account for this very purpose
    
    ```
    personal.newAccount('<YOUR PASSWORD>')
    ```
    
    This will create a new account simply for the sake of mining.
    
8. **Import and unlock an account that you own**

    To work with MetaMask and Truffle during development, you will need to unlock
    accounts that you hold the private key to.
    
    ```
    personal.importRawKey("<PRIVATE KEY WITHOUT LEADING 0x>", "<YOUR ACCOUNT'S PASSWORD>")
    personal.unlockAccount("<YOUR ADDRESS>", "<YOUR ACCOUNT'S PASSWORD>", 150000)
    ```
    
9. **Run a mining thread**
    
    Now with everything setup, simply run
    
    ```
    miner.start()
    ```
    
    This will begin a mining thread to mine blocks on your chain.
    
### Setup additional nodes

You may encounter issues with transactions not confirming with a single node on the network,
to prevent this it's necessary to setup and run an additional node to work as a peer with
the original mining node. 

1. **Setting up your chain**
   Follow steps 2-7 from the above instructions in a unique directory meant 
   for your peer node.
   
   In step 6, make sure you use a port that's different from the one running on your
   main node, which's usually 30303.

2. **Add as a peer to the main node**
   To add the node as a peer to the main node, type in **admin.nodeInfo** and you
   should see output along these lines
   
   ```
   {
     enode: "enode://cdadeea38a46543120b36ac1763537519bd4e1e1a5a5365d0cfeddaec1ff1c
   df676b7583974c91da98e0bb06b48976649cdd24d3a1e48f1d16d5963bede57e53@[::]:30303?di
   scport=0",
     id: "cdadeea38a46543120b36ac1763537519bd4e1e1a5a5365d0cfeddaec1ff1cdf676b75839
   74c91da98e0bb06b48976649cdd24d3a1e48f1d16d5963bede57e53",
     ip: "::",
     listenAddr: "[::]:30303",
     name: "Geth/v1.7.2-stable-1db4ecdc/windows-amd64/go1.9",
     ports: {
       discovery: 0,
       listener: 30303
     },
     protocols: {
       eth: {
         difficulty: 94949950,
         genesis: "0x010c74b2ee90fe3b2e5d29bb8e53a4c3e98461d4ebd9b6003ce49972bfdd97
   46",
         head: "0xba92461f8db89d94cba453e3f6c69ed2bbceb822989aed17874a115821049f36"
   ,
         network: 10
       }
     }
   }
   ```
   
   Copy the **enode** value run the following command from your **main node**
   
   ```
   admin.addPeer(<ENODE VALUE>)
   ```
   
   If the node has been added successfully, you can run
   
   ```
   admin.peers
   ```
   
   and you should see your node show up like so
   
   ```
   [{
       caps: ["eth/63"],
       id: "a525be9b6e90821936fa1d0280f00afd9806c5fdf4f8d8a865d163ffab5172db60c4e40
   317fae5576cc236c2ac8cb0b8c5f98dba90795ae1c46874162c731543",
       name: "Geth/v1.7.2-stable-1db4ecdc/windows-amd64/go1.9",
       network: {
         localAddress: "<IP>:56447",
         remoteAddress: "<IP>:30304"
       },
       protocols: {
         eth: {
           difficulty: 1024,
           head: "0x010c74b2ee90fe3b2e5d29bb8e53a4c3e98461d4ebd9b6003ce49972bfdd974
   6",
           version: 63
         }
       }
   }]
   ```
  
3. Once you have the node setup, follow step 9 in the [instructions](#instructions) above
   to begin mining your chain.
   
4. If you'd like to reset your chain at anytime, simply delete the **ethdata** directory
   in all your node directories and run all steps from step 5 in 
   [instructions](#instructions).
   
### Caveats

* If MetaMask is used for signing and sending transactions, MetaMask will not reset the 
  last transaction's nonce whenever your network's re-created. 
 
  This will lead to queued transactions on your network which won't get mined. 
  MetaMask would have to be removed and re-added to Chrome to fix the network's 
  transaction nonce.
  