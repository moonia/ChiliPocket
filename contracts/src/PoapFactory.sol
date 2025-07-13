// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoapFactory is ERC721URIStorage, Ownable {
    uint256 public nextPoapId;
    uint256 public nextClaimId = 1;

    struct PoapMetadata {
        uint256 id;
        string name;
        string description;
        string imageIPFS;
        uint256 durability;
    }

    mapping(uint256 => PoapMetadata) private poaps;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;
    mapping(uint256 => uint256) public claimedFrom;
    mapping(uint256 => uint256) public poapClaimsCount;

    event PoapCreated(
        uint256 indexed poapId,
        address indexed owner,
        string name,
        string description,
        string imageIPFS
    );
    event PoapClaimed(
        uint256 indexed poapId,
        address indexed claimer,
        uint256 indexed claimId
    );

    constructor() ERC721("POAP", "POAP") Ownable(msg.sender) {}

    function getPoaps() public view returns (PoapMetadata[] memory) {
        return poaps;
    }

    function createPoap(
        string memory name,
        string memory description,
        string memory imageIPFS,
        string memory metadataURI,
        uint256 durability
    ) public onlyOwner {
        uint256 poapId = nextPoapId;
        poaps[poapId] = PoapMetadata(poapId, name, description, imageIPFS, durability);

        _mint(msg.sender, poapId);
        _setTokenURI(poapId, metadataURI);

        emit PoapCreated(poapId, msg.sender, name, description, imageIPFS);

        nextPoapId++;
    }

    function getPoap(uint256 poapId) public view returns (PoapMetadata memory) {
        return poaps[poapId];
    }

    function poapExists(uint256 poapId) public view returns (bool) {
        return poapId < nextPoapId;
    }

    function claimPoap(uint256 poapId) public {
        require(poapExists(poapId), "POAP does not exist");
        require(!hasClaimed[msg.sender][poapId], "Already claimed");
        require(poapClaimsCount[poapId] < poaps[poapId].durability, "Claim limit reached");

        uint256 newTokenId = nextClaimId;
        _safeMint(msg.sender, newTokenId);

        string memory poapMetadataURI = tokenURI(poapId);
        _setTokenURI(newTokenId, poapMetadataURI);

        hasClaimed[msg.sender][poapId] = true;
        claimedFrom[newTokenId] = poapId;
        poapClaimsCount[poapId]++;

        emit PoapClaimed(poapId, msg.sender, newTokenId);

        nextClaimId++;
    }
}
