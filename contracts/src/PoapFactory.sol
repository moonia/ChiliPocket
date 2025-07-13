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
        address owner;
    }

    mapping(uint256 => PoapMetadata) private poaps;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;
    mapping(uint256 => uint256) public claimedFrom;
    mapping(uint256 => uint256) public poapClaimsCount;
    mapping(address => uint256[]) public userClaimedIds;

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
        PoapMetadata[] memory result = new PoapMetadata[](nextPoapId);
        for (uint256 i = 0; i < nextPoapId; i++) {
            result[i] = poaps[i];
        }
        return result;
    }

    function createPoap(
        string memory name,
        string memory description,
        string memory imageIPFS,
        string memory metadataURI,
        uint256 durability
    ) public onlyOwner {
        uint256 poapId = nextPoapId;
        poaps[poapId] = PoapMetadata(poapId, name, description, imageIPFS, durability, msg.sender);

        _mint(msg.sender, poapId);
        _setTokenURI(poapId, metadataURI);

        emit PoapCreated(poapId, msg.sender, name, description, imageIPFS);

        nextPoapId++;
    }

    function getPoap(uint256 poapId) public view returns (PoapMetadata memory) {
        require(poapExists(poapId), "Poap does not exist");
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
        userClaimedIds[msg.sender].push(newTokenId);

        emit PoapClaimed(poapId, msg.sender, newTokenId);

        nextClaimId++;
    }

    function getParticipatedPoaps(address user) public view returns (PoapMetadata[] memory) {
        uint256[] memory tokenIds = userClaimedIds[user];
        PoapMetadata[] memory result = new PoapMetadata[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            result[i] = poaps[poapId];
        }

        return result;
    }
}
