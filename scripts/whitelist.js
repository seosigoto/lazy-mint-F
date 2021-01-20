const Web3 = require('web3');
const fs = require("fs");
const ethers = require("ethers");
const listdata = require("./whitelist_0119.json");
const ABI = require("./../artifacts/contracts/Lazy.sol/Lazy.json");
var result = [];
require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;

var provider = 'https://eth-rinkeby.alchemyapi.io/v2/fZMpcxd34B7sb8xuPi-9FrJQymkgwGek';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

async function main() {
    var i,j, temporary, chunk = 100;

    const provider = new ethers.providers.AlchemyProvider("rinkeby", "fZMpcxd34B7sb8xuPi-9FrJQymkgwGek");
    for (i = 0,j = listdata.length; i < j; i += chunk) {
        temporary = listdata.slice(i, i + chunk);
        const wallet = await new ethers.Wallet(privateKey, provider);

        const nftContract = new ethers.Contract("0xc3751eF32E800415804007c43dF137Ff43E78E97", ABI.abi, wallet);
        const tx = await nftContract.connect(wallet).addBulkWhitelistUser(temporary);
    }
}

main()