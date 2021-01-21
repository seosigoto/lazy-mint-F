# Lazy Minting NFTs
See `test/test.js` for example and comments.

_this isn't actually super hack resistent_
Someone could look at the params to another NFT purchase and use the same params to mint an NFT that was technically already claimed. You can use it to prove that the an owner "agrees" a certain param is accetable, but curretly not sure how to prove that something is already claimed.


1. env file need; infura, pinata, etherscan, wallet, info need ( api key and private key)
2. deploy the smart contract; lazy.sol and royalty
3. after verifying, white list importing use whitelist.js node script; 
4. attribute.js node script for pinata, and save the tokenURI data 
5. deploy private key need for making result.json; getting sign message
6. save the ABI file for front end and  DB updating for msg
