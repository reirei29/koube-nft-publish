require('dotenv').config();
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL_TEST;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const alchemyWeb3 = createAlchemyWeb3(ALCHEMY_API_URL);
const contract = require("../artifacts/contracts/ERC721_NFT.sol/ERC721_NFT.json");
const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
const nftContract = new alchemyWeb3.eth.Contract(contract.abi, contractAddress);

const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

async function mintNFT(tokenURI) {
    const nonce = await alchemyWeb3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest');
    const tx = {
        from: METAMASK_PUBLIC_KEY,
        to: contractAddress,
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
        .then((signedTx) => {
            alchemyWeb3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log(
                            "The hash of our transaction is: ",
                            hash,
                            "\nSubmitting is completed successfully."
                        );
                    } else {
                        console.log(
                            "Something went wrong when submitting our transaction:",
                            err
                        );
                    }
                }
            );
        })
        .catch((err) => {
            console.log(" Promise failed:", err);
        });
}

mintNFT("https://ipfs.io/ipfs/QmdZMtdApdeobM5iCRcWqAMByfG4No8tW4oheb7jQjKgTm")