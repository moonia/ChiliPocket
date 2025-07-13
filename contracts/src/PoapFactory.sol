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
        uint256 startDate;
        uint256 endDate;
        uint256 maxPeople;
        uint256 currentPeopleAttending;
        address owner;
    }

    mapping(uint256 => PoapMetadata) private poaps;
    mapping(address => mapping(uint256 => bool)) public hasClaimed;
    mapping(uint256 => uint256) public claimedFrom;
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

    function createPoap(
        string memory name,
        string memory description,
        string memory imageIPFS,
        string memory metadataURI,
        uint256 startDate,
        uint256 endDate,
        uint256 maxPeople
    ) public onlyOwner {
        require(startDate < endDate, "Start date must be before end date");

        uint256 poapId = nextPoapId;
        poaps[poapId] = PoapMetadata(
            poapId,
            name,
            description,
            imageIPFS,
            startDate,
            endDate,
            maxPeople,
            0,
            msg.sender
        );

        _mint(msg.sender, poapId);
        _setTokenURI(poapId, metadataURI);

        emit PoapCreated(poapId, msg.sender, name, description, imageIPFS);

        nextPoapId++;
    }

    function getPoaps() public view returns (PoapMetadata[] memory) {
        PoapMetadata[] memory result = new PoapMetadata[](nextPoapId);
        for (uint256 i = 0; i < nextPoapId; i++) {
            result[i] = poaps[i];
        }
        return result;
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

        PoapMetadata storage poap = poaps[poapId];

        require(block.timestamp <= poap.endDate, "Event is over");
        require(poap.currentPeopleAttending < poap.maxPeople, "Max participants reached");

        uint256 newTokenId = nextClaimId;
        _safeMint(msg.sender, newTokenId);

        string memory poapMetadataURI = tokenURI(poapId);
        _setTokenURI(newTokenId, poapMetadataURI);

        hasClaimed[msg.sender][poapId] = true;
        claimedFrom[newTokenId] = poapId;
        userClaimedIds[msg.sender].push(newTokenId);
        poap.currentPeopleAttending++;

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

    function getOwnedPoaps() public view returns (PoapMetadata[] memory) {
        uint256[] memory tokenIds = userClaimedIds[msg.sender];
        PoapMetadata[] memory result = new PoapMetadata[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            result[i] = poaps[poapId];
        }

        return result;
    }

    function getCurrentParticipatingPoaps() public view returns (PoapMetadata[] memory) {
        uint256[] memory tokenIds = userClaimedIds[msg.sender];

        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            if (
                block.timestamp >= poaps[poapId].startDate &&
                block.timestamp <= poaps[poapId].endDate
            ) {
                count++;
            }
        }

        PoapMetadata[] memory result = new PoapMetadata[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            if (
                block.timestamp >= poaps[poapId].startDate &&
                block.timestamp <= poaps[poapId].endDate
            ) {
                result[index++] = poaps[poapId];
            }
        }

        return result;
    }

    function getPastParticipatingPoaps() public view returns (PoapMetadata[] memory) {
        uint256[] memory tokenIds = userClaimedIds[msg.sender];

        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            if (block.timestamp > poaps[poapId].endDate) {
                count++;
            }
        }

        PoapMetadata[] memory result = new PoapMetadata[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 poapId = claimedFrom[tokenIds[i]];
            if (block.timestamp > poaps[poapId].endDate) {
                result[index++] = poaps[poapId];
            }
        }

        return result;
    }
}
