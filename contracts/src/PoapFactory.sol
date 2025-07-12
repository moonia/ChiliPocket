// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PoapFactory is ERC721URIStorage {
    uint256 public nextPoapId;

    struct PoapMetadata {
        string name;
        string description;
        string imageIPFS;
        uint256 durability;
    }

    mapping(uint256 => PoapMetadata) public poaps;

    event PoapCreated(uint256 indexed poapId, address indexed owner, string name, string description, string imageIPFS);

    constructor() ERC721("POAP", "POAP") {}

    function createPoap(
        string memory name,
        string memory description,
        string memory imageIPFS,
        string memory tokenURI,
        uint256 durability
    ) public {
        uint256 poapId = nextPoapId;
        poaps[poapId] = PoapMetadata(name, description, imageIPFS, durability);

        _mint(msg.sender, poapId);
        _setTokenURI(poapId, tokenURI);

        emit PoapCreated(poapId, msg.sender, name, description, imageIPFS);

        nextPoapId++;
    }

    function getPoap(uint256 poapId) public view returns (PoapMetadata memory) {
        return poaps[poapId];
    }
}