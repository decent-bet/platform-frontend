# Decent.bet Platform Frontend

Built with Truffle's [React Box](http://truffleframework.com/boxes/react)

Consists of the platform pages - Sports betting, casino, house and more. The decent.bet website's repository can be found [here](https://github.com/decent-bet/web-frontend)

For a higher level overview on how the platform works, refer to [this document](https://github.com/decent-bet/platform-frontend/blob/master/docs/platform-architecture.md)

## Development

To work with the platform, you'll have to deploy the contract to a locally running ganache-cli instance. 

1. Install [Ganache-cli](https://github.com/trufflesuite/ganache-cli)

    ```
    npm install -g ganache-cli@beta
    ```

2. Run Ganache-cli with the following configuration
    
    **For development**
    ```
    ganache-cli --mnemonic "mimic soda meat inmate cup someone labor odor invest scout fat ketchup" -l 6732810
    ```
    
    **To mimic testnet**
    ```
    ganache-cli --mnemonic "mimic soda meat inmate cup someone labor odor invest scout fat ketchup" -b 20 -l 6732810
    ```
    
3. Add a .env file to the current directory with the following variables

    ```
    MNEMONIC='<MNEMONIC TO DEPLOY CONTRACTS AND CONTROL THE PLATFORM>'
    INFURA_KEY='<REGISTERED INFURA KEY>'
    DEFAULT_ACCOUNT='<DEFAULT ACCOUNT LINKED TO YOUR MNEMONIC>'
    ```
    
4. Migrate contracts to ganache-cli

    ```
    truffle migrate
    ```
    
5. Run [the platform init scripts](https://github.com/decent-bet/platform-contracts-init) to get the platform contracts initialized to a state with session one started with a functional Sportsbook and Slots.
    
6. Run the webpack server for front-end hot reloading. For now, smart contract changes must be manually recompiled and migrated.

    ```
    npm run start
    ```

7. To build the application for production, use the build command. A production build will be in the build_webpack folder.

    ```
    npm run build
    ```

8. Deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2) or [serve](https://github.com/zeit/serve)
