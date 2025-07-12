// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/PoapFactory.sol";

contract POAPFactoryTest is Test {
    PoapFactory public poap;

    function setUp() public {
        poap = new PoapFactory();
    }

    function testMint() public {
        vm.prank(address(1));
        poap.createPoap("NewPoap", "Test", "ipfs://QmXYZ", "ipfs://QmXYZ/metadata.json", 1234567);

        assertEq(poap.ownerOf(0), address(1));

        PoapFactory.PoapMetadata memory metadata = poap.getPoap(0);
        assertEq(metadata.name, "NewPoap");
        assertEq(metadata.description, "Test");
        assertEq(metadata.imageIPFS, "ipfs://QmXYZ");
        assertEq(metadata.durability, 1234567);
        assertEq(poap.tokenURI(0), "ipfs://QmXYZ/metadata.json");
    }
}
