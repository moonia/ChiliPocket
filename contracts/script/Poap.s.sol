// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {PoapNFT} from "../src/Poap.sol";

contract PoapScript is Script {
    PoapNFT public poapnft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        poapnft = new PoapNFT();

        vm.stopBroadcast();
    }
}
