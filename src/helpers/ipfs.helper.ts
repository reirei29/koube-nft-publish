import axios from "axios";
import * as fs from 'fs';
import FormData from "form-data"

export const pinJSONToIPFS = async(JSONBody:any, key:any, secret:any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               url: "https://ipfs.io/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
        });
};

export const pinFileToIPFS = async(path:any, key:any, secret:any) => {
    const formData = new FormData();

    let options = {
        pinataMetadata:{
            name: path
        },
        pinataOptions:{
            cidVersion:0
        }
    }

    let fileData:any = fs.createReadStream(path)
    
    //formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
    formData.append('file', fileData);

    formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
    
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    return axios
        .post(url, formData, {
            //maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               url: "https://ipfs.io/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }
        });
};