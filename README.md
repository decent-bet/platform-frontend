# Decent.bet Platform Frontend

Consists of the platform pages - Slots betting casino and more.

## Getting Started

### Requirements

1. [Node](https://nodejs.org) v10.12.0 with npm
2. [NVM](https://github.com/creationix/nvm)
3. Thor:
   _To work with the platform frontend, you'll have to deploy the contracts to a locally running [Vechain Thor](https://github.com/vechain/thor) instance, follow the instructions in [https://github.com/vechain/thor](https://github.com/vechain/thor) for local install or use with docker. For now, You can find the contracts published as a npm package [@decent-bet/contract-slots](https://www.npmjs.com/package/@decent-bet/contract-slots)_.
4. KYC Backend running (with own dependencies)
5. Slots Channels API running (with own dependencies)

### Development

1. Clone de repository:
    ```bash
    git clone git@github.com:decent-bet/platform-frontend.git
    ```
    ```bash
    cd platform-frontend
    ```
    _If you use nvm run:_
    ```bash
    nvm use
    ```
2. Install dependencies:

    ```bash
    npm i
    ```

3. Update git submodules for games:
    ```bash
    git submodule update --init
    ```
    > Or for specific branchd run
    ```bash
    git submodule foreach git checkout origin [YOUR_BRANCH] && git submodule foreach git pull origin [YOUR_BRANCH]
    ```
4. Run the dev server for frontend hot reloading:

    ```bash
    npm start
    ```

    ***

    You can open your browser and open [http://localhost:3000](http://localhost:3000).

### Build, Deployment and npm scripts

-   To build the application for development, staging or production, use the corresponding npm script. A bundle will be in the **_build_** folder at the root of the application.

    Just run `npm run [NPM_SCRIPT]`

    -   `games`: Copy all the games from our private package to the `public/slots` folder,
    -   `start`: Starts the dev server with `local` environtment,
    -   `start:develop`: Starts the dev server with `development` environtment,
    -   `start:staging`: Starts the dev server with `staging` environtment,
    -   `start:prod`: Starts the dev server with `production` environtment,
    -   `build:local`: Make a bundle build with `local` environtment
    -   `build:develop`: Make a bundle build with `development` environtment
    -   `build:staging`: Make a bundle build with `staging` environtment
    -   `build:prod`: Make a bundle build with `production` environtment
    -   `deploy`: Build a container image and Deploy to GCP.
    -   `deploy:develop`: Build a container image and deploy to GCP, Runs the script `build:develop` inside the container.
    -   `deploy:staging`: Build a container image and deploy to GCP, Runs the script `build:staging` inside the container.
    -   `deploy:prod`: Build a container image and deploy to GCP, Runs the script `build:prod` inside the container.
    -   `deploy:local`: Build a container image and run on local with docker-compose, Runs the script `build:local` inside the container.

-   You can deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2), [serve](https://github.com/zeit/serve) or [nginx](https://nginx.org/).

-   If you want, you can deploy using docker, check or [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) files.
