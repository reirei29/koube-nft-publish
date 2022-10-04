require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { ALCHEMY_API_URL_TEST, ALCHEMY_API_URL_MAIN,  METAMASK_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
module.exports = {
    solidity: "0.8.4",
    defaultNetwork: "rinkeby",
    networks: {
        hardhat: {},
        rinkeby : {
            url: ALCHEMY_API_URL_TEST,
            accounts: [`${METAMASK_PRIVATE_KEY}`]
        },
        main : {
            url: ALCHEMY_API_URL_MAIN,
            accounts: [`${METAMASK_PRIVATE_KEY}`]
        }
    },
    etherscan:{
        apiKey: `${ETHERSCAN_API_KEY}`
    }
    
}