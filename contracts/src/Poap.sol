// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoapNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasClaimed;

    constructor() ERC721("ChilizPOAP", "CPOAP") {
        tokenCounter = 0;
    }

    function claimPOAP(string token) public {
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, "ipfs://QmXYZ.../metadata.json");

        hasClaimed[msg.sender] = true;
        tokenCounter++;
    }
}
