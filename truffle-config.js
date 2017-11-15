module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "10", // Match any network id,
            from: "0xf2d6ff4adf714d994e1bfba2568432c1c8b6f257"
        }
    }
}
