// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;

import "./Greater.sol";
import "../libraries/proxy/OptimizedTransparentUpgradeableProxy.sol";

contract MockFactory {
    address public implementation;

    function setImplementation(address _impl) external {
        require(_impl != address(0), "Not allow zero address");
        implementation = _impl;
    }

    function deployImplementation() external {
        implementation = address(new Greater());
    }

    function createContract() external returns (address deployedAddr) {
        require(implementation != address(0), "Please set implementation");
        OptimizedTransparentUpgradeableProxy pairProxy = new OptimizedTransparentUpgradeableProxy();
        pairProxy._OptimizedTransparentUpgradeableProxy_init_(address(this), address(0), hex"");
        deployedAddr = address(pairProxy);
    }
}
