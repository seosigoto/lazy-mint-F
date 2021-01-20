// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Lazy is  ERC721URIStorage, EIP712 ,AccessControl, Ownable, ERC721Enumerable {

    using ECDSA for bytes32;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint initialPrice = 0.25 ether;

    uint shareOfSale1 = 8300;
    uint shareOfSale2 = 1500;
    uint shareOfSale3 = 200;

    uint shareOfWhitelist1 = 5800;
    uint shareOfWhitelist2 = 4000;
    uint shareOfWhitelist3 = 200;

    // the address all signatures need to verify against
    mapping(address => bool) whiteLists;

    constructor(address payable minter) 
        ERC721("LAZY-MINTED_BOIS", "LAZY") 
        EIP712("LazyNFT-Voucher", "1") {
            _setupRole(MINTER_ROLE, minter);
        }

    // address owner1 = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
    // address owner2 = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
    // address owner3 = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;

    // Wayne - Wallet 1(83% or 58%)
    address owner1 = 0x5db8Bb85D6065f95350d8AE3934D72Ad0aB3Ae7E;
    //Mark - Wallet 2(40% or 15%)
    address owner2 = 0x04d59D5699E1B28161eA972fFD81a6705bFEB8A3;
    // Hardik Wallet 3 (2%):
    address owner3 = 0x8FfAf9E4E61e4fBc5BA749Be4498a08783b166b6;

    function _verify(string calldata message, bytes calldata sign) public pure returns (address) {
        bytes32 b = keccak256(abi.encodePacked(message));
        return b.toEthSignedMessageHash().recover(sign);
    }

    function mintToken(uint256 amount, string[] calldata message, bytes[] calldata sign) public payable{
        require(message.length == amount, "Invalid number of messages");
        require(msg.value == initialPrice * amount, "not enough money");
        require(totalSupply() + amount <= 10000, "over the 10000");
        for (uint256 index = 0; index < amount; index++) {
            address signer =_verify(message[index], sign[index]);
            require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");
            _tokenIds.increment();
            uint256 tokenId = _tokenIds.current();
            _mint(signer, tokenId);
            _setTokenURI(tokenId, message[index]);        
            _transfer(signer, msg.sender, tokenId); 
        }
                
        uint shareamount1;
        uint shareamount2;
        uint shareamount3;

        if (whiteLists[msg.sender]) {
            shareamount1 = shareOfWhitelist1;
            shareamount2 = shareOfWhitelist2;
            shareamount3 = shareOfWhitelist3;            
        }else{
            shareamount1 = shareOfSale1;
            shareamount2 = shareOfSale2;
            shareamount3 = shareOfSale3;   
        }
        (bool sent, ) = payable(owner1).call{value: (msg.value * amount * shareamount1/ 10000)}("");
        require(sent, "Failed to send Ether");
        (sent, ) = payable(owner2).call{value: (msg.value * amount * shareamount2/ 10000)}("");
        require(sent, "Failed to send Ether");
        (sent, ) = payable(owner3).call{value: (msg.value * amount * shareamount3/ 10000)}("");
        require(sent, "Failed to send Ether");
    }

    function addWhitelistuser(address user) public onlyOwner{
        whiteLists[user] = true;
    }

    function addBulkWhitelistUser(address[] memory users) public onlyOwner{
        for(uint i = 0; i< users.length; i++){
            whiteLists[users[i]] = true;
        }
    }

    function removeWhitelistuser(address user) public onlyOwner{
        whiteLists[user] = false;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721, ERC721Enumerable) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal virtual override (ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override (ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // function mint(uint256 tokenId, uint index) public onlyOwner{
    //     _mint(msg.sender, tokenId);
    //     string[] memory see = new string[](5);
    //     see[0] = 'https://gateway.pinata.cloud/ipfs/QmewR7QpPXUD9RKpy85KP1hwYHhyYn3oMuZn5i2PhuSS5A/1.json';
    //     see[1] = 'https://gateway.pinata.cloud/ipfs/QmewR7QpPXUD9RKpy85KP1hwYHhyYn3oMuZn5i2PhuSS5A/2.json';
    //     see[2] = 'https://gateway.pinata.cloud/ipfs/QmewR7QpPXUD9RKpy85KP1hwYHhyYn3oMuZn5i2PhuSS5A/3.json';
    //     see[3] = 'https://gateway.pinata.cloud/ipfs/QmewR7QpPXUD9RKpy85KP1hwYHhyYn3oMuZn5i2PhuSS5A/4.json';
    //     see[4] = 'https://gateway.pinata.cloud/ipfs/QmewR7QpPXUD9RKpy85KP1hwYHhyYn3oMuZn5i2PhuSS5A/5.json';

    //     _setTokenURI(tokenId, see[index]); 
    // }
        
}