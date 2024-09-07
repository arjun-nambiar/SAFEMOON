// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interface/ITradeRouter.sol";

// mock class using ERC20
contract TradeRouter is ITradeRouter {
    address public router;

    function swapRouter() external view override returns (address) {
        return router;
    }

    function swapExactETHForTokensWithFeeAmount(Trade calldata trade, uint256 _feeAmount) external payable override {}

    function getSwapFees(uint256 amountIn, address[] memory path) external pure override returns (uint256 _fees) {
        _fees = 0;
    }

    function setRouter(address addr) external {
        router = addr;
    }
}
