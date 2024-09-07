// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interface/ITradeRouter.sol";

// mock class using ERC20
contract Router {
    function WETH() external view returns (address) {
        return address(this);
    }
}
