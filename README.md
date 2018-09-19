# Decent.bet Platform Frontend

Consists of the platform pages - Slots betting casino and more. 

## Getting Started

### Requirements
1. [Node](https://nodejs.org) v9.11.2 
2. [NVM](https://github.com/creationix/nvm) (Recomended) 
3. [Yarn](https://yarnpkg.com): `npm i -g yarn`
4. Thor:
*To work with the platform frontend, you'll have to deploy the contracts to a locally running [Vechain Thor](https://github.com/vechain/thor) instance, follow the instructions in [https://github.com/vechain/thor](https://github.com/vechain/thor) for local install or use with docker. For now, You can find the contracts published as a npm package [@decent-bet/contract-slots](https://www.npmjs.com/package/@decent-bet/contract-slots)*.


### Development

1. Clone de repository:
    ```bash
    git clone git@github.com:decent-bet/platform-frontend.git
    ```
    ```bash
    cd platform-frontend
    ```
    *If you use nvm run:*
    ```bash
    nvm use
    ```
2. Install dependencies:

    ```bash
    yarn install
    ```
3. Update git submodules for games:
    ```bash
    git submodule update --init
    ```
4. Run the webpack server for frontend hot reloading:
    - For local thor node and api
    ```bash
    yarn start
    ```
    - For production thor node and api
    ```bash
    yarn start:prod
    ```
    ---
    You can open your browser and open [http://localhost:3007](http://localhost:3007).
    

### Deployment

-  To build the application for production, use the build command. A production build will be in the build_webpack folder.

    ```bash
    yarn build
    ```

-  You can deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2), [serve](https://github.com/zeit/serve) or [nginx](https://nginx.org/).

- If you want, you can deploy using docker, check or [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) files.

