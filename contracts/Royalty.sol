// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract royalty {
    
    uint shareOfRoyalty1 = 9800;
    uint shareOfRoyalty2 = 100;
    uint shareOfRoyalty3 = 100;

      // Wayne - Wallet 1
    address addr1 = 0x5db8Bb85D6065f95350d8AE3934D72Ad0aB3Ae7E;
    //Mark - Wallet 2
    address addr2 = 0x04d59D5699E1B28161eA972fFD81a6705bFEB8A3;
    // Hardik Wallet 3 :
    address addr3 = 0x8FfAf9E4E61e4fBc5BA749Be4498a08783b166b6;

    receive() external payable {}

    function clame() external payable {
        uint total = address(this).balance;
        require(msg.sender == addr1 || msg.sender == addr2 || msg.sender == addr3,
            "no permission address");
       
        (bool sent, ) = addr1.call{value: (total*shareOfRoyalty1/10000)}("");
        require(sent, "Failed to send to address 1 ");
        (sent, ) = addr2.call{value: (total*shareOfRoyalty2/10000)}("");
        require(sent, "Failed to send to address 1");
        (sent, ) = addr3.call{value: (total*shareOfRoyalty3/10000)}("");
        require(sent, "Failed to send to address 1");
    }
}
