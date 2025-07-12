// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoapFactory is ERC721URIStorage, Ownable {
    uint256 public nextPoapId;
    uint256 public nextClaimId;

    struct PoapMetadata {
        string name;
        string description;
        string imageIPFS;
        uint256 durability;
    }

    mapping(uint256 => PoapMetadata) public poaps;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;

    event PoapCreated(uint256 indexed poapId, address indexed owner, string name, string description, string imageIPFS);
    event PoapClaimed(uint256 indexed poapId, address indexed claimer);

    constructor() ERC721("POAP", "POAP") Ownable(msg.sender) {}

    function createPoap(
        string memory name,
        string memory description,
        string memory imageIPFS,
        string memory tokenURI,
        uint256 durability
    ) public onlyOwner {
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

    function poapExists(uint256 poapId) public view returns (bool) {
        return poapId < nextPoapId;
    }

    function claimPoap(uint256 poapId, string memory tokenURI) public {
        require(poapExists(poapId), "POAP does not exist");
        require(!hasClaimed[msg.sender][poapId], "Already claimed");

        uint256 newTokenId = nextClaimId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        hasClaimed[msg.sender][poapId] = true;
        emit PoapClaimed(poapId, msg.sender);

        nextClaimId++;
    }
}
