// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITradeRouter {
    function swapRouter() view external returns (address);
    struct Trade {
        uint256 amountIn;
        uint256 amountOut;
        address[] path;
        address payable to;
        uint256 deadline;
    }

    function swapExactETHForTokensWithFeeAmount(
        Trade calldata trade,
        uint256 _feeAmount
    ) external payable;

    function getSwapFees(uint256 amountIn, address[] memory path) external view returns (uint256 _fees);
}