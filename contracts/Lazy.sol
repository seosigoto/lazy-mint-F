// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Lazy is  ERC721URIStorage, EIP712 ,AccessControl {

    using ECDSA for bytes32;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint initialPrice = 0.25 ether;

    uint shareOfSale1 = 8300;
    uint shareOfSale2 = 1500;
    uint shareOfSale3 = 200;
    uint shareOfRoyalty1 = 9800;
    uint shareOfRoyalty2 = 100;
    uint shareOfRoyalty3 = 100;
    uint shareOfWhitelist1 = 4000;
    uint shareOfWhitelist2 = 5800;
    uint shareOfWhitelist3 = 200;

    // the address all signatures need to verify against
    mapping(address => bool) whiteLists;

    constructor(address payable minter) 
        ERC721("LAZY-MINTED_BOIS", "LAZY") 
        EIP712("LazyNFT-Voucher", "1") {
            _setupRole(MINTER_ROLE, minter);
        }

    address owner1 = 0x0D4ae8efFBCdf74F6005A4a4B6A28B50f36B75f0;
    address owner2 = 0x0D4ae8efFBCdf74F6005A4a4B6A28B50f36B75f0;
    address owner3 = 0x0D4ae8efFBCdf74F6005A4a4B6A28B50f36B75f0;


    /// @dev verifies the param "message" is valid
    /// "owner" signs message and submits signature as "sign" in this function
    /// then, anyone can call this function with that signature and the message param.
    /// If anyone tries to call the funcntion with a message different than the one
    /// owner used to sign the message then it will return false.
    function _verify(string calldata message, bytes calldata sign) internal pure returns (address) {
        bytes32 b = keccak256(abi.encodePacked(message));
        return b.toEthSignedMessageHash().recover(sign);
    }

    function mintToken(string calldata message, bytes calldata sign) public payable{
        address signer =_verify(message, sign);
        require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");
        require(msg.value == initialPrice, "not enough money");

        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _mint(signer, tokenId);
        _setTokenURI(tokenId, message);        
        _transfer(signer, msg.sender, tokenId); 
        
        sendmoney(msg.sender);
    }

    function sendmoney(address iswhite) internal {
        uint shareamount1;
        uint shareamount2;
        uint shareamount3;

        if (whiteLists[iswhite]) {
            shareamount1 = shareOfWhitelist1;
            shareamount2 = shareOfWhitelist2;
            shareamount3 = shareOfWhitelist3;            
        }else{
            shareamount1 = shareOfSale1;
            shareamount2 = shareOfSale2;
            shareamount3 = shareOfSale3;   
        }
        (bool sent, ) = payable(owner1).call{value: (msg.value * shareamount1/ 10000)}("");
        require(sent, "Failed to send Ether");
        (sent, ) = payable(owner2).call{value: (msg.value * shareamount2/ 10000)}("");
        require(sent, "Failed to send Ether");
        (sent, ) = payable(owner3).call{value: (msg.value * shareamount3/ 10000)}("");
        require(sent, "Failed to send Ether");
    }


    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
        
}