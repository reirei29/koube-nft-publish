import express from "express"
import ipfsRoute from "./ipfs.route"
import blockchainRoute from "./blockchain.route"

export const apiRoutes = express.Router()

apiRoutes.post("/ipfs/upload", ipfsRoute.addPost);
apiRoutes.post("/blockchain/mint", blockchainRoute.mintPost);
apiRoutes.post("/blockchain/token/list", blockchainRoute.getTokenListPost);

