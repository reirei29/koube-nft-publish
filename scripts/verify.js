require('dotenv').config();

const hre = require('hardhat')

const name = process.env.NFT_NAME
const symbol = process.env.NFT_SYMBOL

async function main() {
  await hre.run('verify:verify', {
    address: process.env.NFT_CONTRACT_ADDRESS,
    constructorArguments: [
      name,
      symbol,
    ],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })