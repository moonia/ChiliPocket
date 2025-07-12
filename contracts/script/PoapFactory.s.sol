// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {PoapFactory} from "../src/PoapFactory.sol";

contract PoapScript is Script {
    PoapFactory public poapnft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        poapnft = new PoapFactory();

        vm.stopBroadcast();
    }
}
