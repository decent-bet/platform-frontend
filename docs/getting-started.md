# Getting Started

## Pre-requisites

To begin working with the platform, you will need to have truffle and [Geth](https://geth.ethereum.org/downloads/) installed for local development

    npm install -g truffle // Version 3.0.5+ required.
    
Make sure you're [running a private network](https://github.com/decent-bet/platform-frontend/blob/master/docs/setting-up-a-private-network.md) 
when you're working with the platform locally.
    
## Setting up

To run the Decent.bet platform, you will need to use the following repositories:

## Smart Contracts

* [Platform frontend](https://github.com/decent-bet/platform-frontend)

Run the following command in your terminal to compile and migrate the Decent.bet platform contracts to your local TestRPC 
instance.

    truffle migrate

Use the resulting build files in [Platform Frontend](https://github.com/decent-bet/platform-frontend), 
[Admin Frontend](https://github.com/decent-bet/admin-frontend) and [Games Api](https://github.com/decent-bet/games-api). 
Alternatively, scripts can be used to migrate contracts to the network and copy the 
resulting build files to the respective project directories.

## Frontend

* [Platform frontend](https://github.com/decent-bet/platform-frontend) Used by the end user to interact with 
the Decent.bet House, Casino and Sportsbook.
* [Admin frontend](https://github.com/decent-bet/admin-frontend) Used by authorized personnel for the house, 
sports oracle and betting providers to manage their respective entities.

Both frontend repositories make use of Truffle's [React box](https://github.com/truffle-box/react-box). 
To begin working with them, simply clone either repository and run 

    npm install
    
Now, if you haven't migrated the platform contracts to your local testRPC instance, follow the steps in 
the [Smart Contracts](#smart-contracts) section to add the build files to the project's root directory.

Once you have the build files in the root directory's build/contracts folder, run the following command

    npm run start

## Backend

* [Sports API](https://github.com/decent-bet/sports-api) Retrieves sports data from Pinnacle's API which 
will be used by ***Admin frontend*** to retrieve the latest sports odds and game data to use with Sports 
Oracles and Betting Providers.
* [Games API](https://github.com/decent-bet/games-api) Used to manage state channels for casino games on 
the platform. Also used to store/retrieve encrypted game state and process game moves.
  
Both backend modules are written in node.js and need the following commands to start

    npm install
    npm run start
    
If you're setting up games API, make sure to follow the steps mentioned in the [Smart Contracts sub-section](#smart-contracts) 
to migrate the platform contracts to your local TestRPC instance and place the necessary build files in the 
projects' root directory.