// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/PoapFactory.sol";

contract PoapFactoryTest is Test {
    PoapFactory public poap;

    function setUp() public {
        vm.prank(address(1));
        poap = new PoapFactory();
    }

    function testCreateAndClaimPoap() public {
        uint256 startDate = block.timestamp;
        uint256 endDate = block.timestamp + 1 days;
        uint256 maxPeople = 100;

        vm.startPrank(address(1));

        poap.createPoap(
            "NewPoap",
            "Test Event",
            "ipfs://QmXYZ",
            "ipfs://QmXYZ/metadata.json",
            startDate,
            endDate,
            maxPeople
        );

        PoapFactory.PoapMetadata memory metadata = poap.getPoap(0);
        assertEq(metadata.name, "NewPoap");
        assertEq(metadata.description, "Test Event");
        assertEq(metadata.imageIPFS, "ipfs://QmXYZ");
        assertEq(metadata.startDate, startDate);
        assertEq(metadata.endDate, endDate);
        assertEq(metadata.maxPeople, maxPeople);
        assertEq(metadata.currentPeopleAttending, 0);
        assertEq(metadata.owner, address(1));

        vm.stopPrank();
        vm.startPrank(address(2));
        poap.claimPoap(0);

        assertEq(poap.ownerOf(1), address(2));

        uint256 claimedPoapId = poap.claimedFrom(1);
        assertEq(claimedPoapId, 0);

        PoapFactory.PoapMetadata memory claimedMetadata = poap.getPoap(claimedPoapId);
        assertEq(claimedMetadata.name, "NewPoap");

        vm.stopPrank();
    }
}
