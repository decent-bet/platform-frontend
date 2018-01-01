require('dotenv').config()

const HDWalletProvider = require("truffle-hdwallet-provider")

const mnemonic = process.env.MNEMONIC
const infuraKey = process.env.INFURA_KEY
const provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/" + infuraKey)

console.log('Deploying with mnemonic', mnemonic, 'and infura key', infuraKey, 'address', provider.address)

module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id,
            from: "0xf2d6ff4adf714d994e1bfba2568432c1c8b6f257"
        },
        rinkeby: {
            provider: provider,
            network_id: 4,
            from: "0xf2d6ff4adf714d994e1bfba2568432c1c8b6f257",
            gas: "6721975",
            gasPrice: "100000000000"
        }
    }
}
