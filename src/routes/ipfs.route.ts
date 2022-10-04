import { Request, Response, NextFunction } from "express"
import {validationResult} from "express-validator"
import multer from "multer"
import util from "util"
import path from "path"
import fs from "fs"

import {imageFilter} from "../helpers/filters.helper"
import {pinFileToIPFS, pinJSONToIPFS} from "../helpers/ipfs.helper"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let upload_path = path.join(`${__dirname}/../public/uploads`);
        if (!fs.existsSync(upload_path)) {
            fs.mkdirSync(upload_path, { recursive: true });
        }
        cb(null, upload_path);
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const addPost = async(req:any, res: Response, next:NextFunction) => {
    let upload = util.promisify(multer({ storage: storage, fileFilter: imageFilter }).array("token_image", 1));
    try {
        await upload(req, res)
        /*const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: 0, 
                message: errors.array() 
            });
        }*/
        if (req.fileValidationError) {
            return res.status(400).json({ 
                success: 0,
                message: req.fileValidationError
            });
        } else if (req.files.length <= 0) {
            return res.status(400).json({ 
                success: 0,
                message: "You must select at least 1 file."
            });
        }

        let ipfsResponse: any = await pinFileToIPFS(req.files[0].path, process.env.PINTA_API_KEY, process.env.PINTA_API_SEC);

        if (!ipfsResponse.success) {
            return res.status(400).json(ipfsResponse);
        }

        ipfsResponse = await pinJSONToIPFS(
            {
                "name": req.body.name,
                "description": req.body.description,
                "external_url": req.body.external_url,
                "image": ipfsResponse.url
            }, 
            process.env.PINTA_API_KEY, 
            process.env.PINTA_API_SEC);
        
        if (!ipfsResponse.success) {
            return res.status(400).json(ipfsResponse);
        }

        return res.status(200).json({
            success: 1,
            url: ipfsResponse.url
        });
    } catch (err) {
        return res.status(400).json({ 
            success: 0,
            message: `Failed to upload files: ${err}`
        });
    }
}

export default { addPost };
