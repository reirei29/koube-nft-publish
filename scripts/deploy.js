async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());
    const NFT = await ethers.getContractFactory("ERC721_NFT");

    const _nft = await NFT.deploy(process.env.NFT_NAME, process.env.NFT_SYMBOL);
    console.log("Contract deployed to address:", _nft.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });