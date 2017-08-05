# Decent.bet Platform Frontend

Built with Truffle's [React Box](http://truffleframework.com/boxes/react)

Consists of the platform pages - Sports betting, slots, house statistics and more. Web-frontend can be found [here](https://github.com/decent-bet/web-frontend)

**For development**

    npm run start


**Build with**

    npm run build


Deploy using [pm2](https://github.com/Unitech/pm2) or [serve](https://github.com/zeit/serve)

###Development

Run TestRPC with the following configuration

**For mimicing testnet**

    testrpc --mnemonic "mimic soda meat inmate cup someone labor odor invest scout fat ketchup" -b 20 -l 6732810
    
**For development**

    testrpc --mnemonic "mimic soda meat inmate cup someone labor odor invest scout fat ketchup" -l 6732810