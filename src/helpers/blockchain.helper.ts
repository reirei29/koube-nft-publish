require('dotenv').config();
const ALCHEMY_API_URL = process.env.REAL_NET=="true"?process.env.ALCHEMY_API_URL_MAIN:process.env.ALCHEMY_API_URL_TEST;
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const contract = require("../../artifacts/contracts/ERC721_NFT.sol/ERC721_NFT.json");
const openSeaAPI = require('api')(`@opensea/v1.0#${process.env.REAL_NET=="true"?'5zrwe3ql2r2e6mn':'1axej81al2r36szi'}`);

let alchemyWeb3 = createAlchemyWeb3(ALCHEMY_API_URL);
let nftContract = new alchemyWeb3.eth.Contract(contract.abi, NFT_CONTRACT_ADDRESS);

const mintNFT = async(tokenURI:any ) => {
    return new Promise(async (resolve, reject) => {
        const nonce = await alchemyWeb3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest');
        const tx = {
            from: METAMASK_PUBLIC_KEY,
            to: NFT_CONTRACT_ADDRESS,
            nonce: nonce,
            gas: 1000000,
            data: nftContract.methods
                .createNFT(METAMASK_PUBLIC_KEY, tokenURI)
                .encodeABI(),
        };
    
        const signPromise = alchemyWeb3.eth.accounts.signTransaction(
            tx,
            METAMASK_PRIVATE_KEY
        );
        signPromise
            .then((signedTx: any) => {
                alchemyWeb3.eth.sendSignedTransaction(
                    signedTx.rawTransaction,
                    function (err: any, hash: any) {
                        if (!err) {
                            resolve(hash)
                        } else {
                            reject(err)
                        }
                    }
                );
            })
            .catch((err: any) => {
                reject(err)
            });
    })
}

const getTokenList = async(offset: number, limit: number) => {
    return new Promise(async (resolve, reject) => {
        let apiEndpoint = process.env.REAL_NET=='true'?'getting-assets':'retrieving-assets-rinkeby'

        let params:any = {
            asset_contract_address: NFT_CONTRACT_ADDRESS,
            order_direction: 'desc',
            offset: offset,
            limit: limit
        }

        if (process.env.REAL_NET=='true') {
            params['X-API-KEY'] = process.env.OPENSEA_API_KEY
            params['include_orders'] = 'false'
        }

        openSeaAPI[apiEndpoint](params)
        .then((res: any) => {
            resolve(res)
        })
        .catch((err: any) => {
            reject(err)
        })
    })
}

export default {mintNFT, getTokenList}