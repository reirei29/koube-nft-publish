import { Request, Response, NextFunction } from "express"
import blockchainHelper from "../helpers/blockchain.helper";

const mintPost = async(req:Request, res: Response, next:NextFunction) => {
    try { 
        blockchainHelper.mintNFT(req.body.url)
        .then((hash) => {
            return res.status(200).json({ 
                success: 1,
                hash: hash
            });
        })
        .catch((err) => {
            return res.status(400).json({ 
                success: 0,
                message: `Failed to mint: ${err}`
            });
        })
    } catch (err) {
        return res.status(400).json({ 
            success: 0,
            message: `Failed to mint: ${err}`
        });
    }
}

const getTokenListPost = async(req: Request, res: Response, next: NextFunction) => {
    try {
        blockchainHelper.getTokenList(req.body.offset, req.body.limit)
        .then((list) => {
            return res.status(200).json({   
                success: 1,
                data: list
            });
        })
        .catch((err) => {
            return res.status(400).json({ 
                success: 0,
                message: `Failed to get token list: ${err}`
            });
        })
    } catch (err) {
        return res.status(400).json({ 
            success: 0,
            message: `Failed to get token list: ${err}`
        });
    }
}

export default { mintPost, getTokenListPost};