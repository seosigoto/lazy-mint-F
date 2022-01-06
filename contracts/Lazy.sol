pragma solidity ^0.7.3;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Lazy is ERC721 {

    using ECDSA for bytes32;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// the address all signatures need to verify against
    address public owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    constructor() public ERC721("LAZY-MINTED_BOIS", "LAZY") {}

    /// @dev verifies the param "message" is valid
    /// "owner" signs message and submits signature as "sign" in this function
    /// then, anyone can call this function with that signature and the message param.
    /// If anyone tries to call the funcntion with a message different than the one
    /// owner used to sign the message then it will return false.
    function _verify(string calldata message, bytes calldata sign) internal view returns (bool) {
        bytes32 b = keccak256(abi.encodePacked(message));
        return b.toEthSignedMessageHash().recover(sign) == owner;
    }

    function mintToken(string calldata message, bytes calldata sign) public {
        require(_verify(message, sign), "NFT params are not valid");

        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, message);
    }
}