// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/Poap.sol";

contract POAPTest is Test {
    PoapNFT public poap;

    function setUp() public {
        poap = new PoapNFT();
    }

    function testMint() public {
        vm.prank(address(1));
        poap.claimPOAP("ipfs://QmXYZ.../metadata.json");
        assertEq(poap.ownerOf(0), address(1));
    }
}
