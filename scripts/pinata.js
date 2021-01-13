const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const pinFileToIPFS = (filepath) => {
    const pinataApiKey = PINATA_API_KEY;
    const pinataSecretApiKey = PINATA_SECRET_API_KEY;
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(filepath));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: 'Name_of_assets',
        description: 'TestDescription_of_assets'
    });
    data.append('pinataMetadata', metadata);

    return new Promise((resolve, reject) => {
        axios.post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

const pinJSONToIPFS = (JSONBody) => {
    const pinataApiKey = PINATA_API_KEY;
    const pinataSecretApiKey = PINATA_SECRET_API_KEY;
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return new Promise((resolve, reject) => {
        axios
            .post(url, JSONBody, {
                headers: {
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

module.exports = {
    pinFileToIPFS,
    pinJSONToIPFS
}