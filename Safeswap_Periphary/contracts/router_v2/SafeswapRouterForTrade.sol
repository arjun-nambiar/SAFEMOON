//// SPDX-License-Identifier: MIT
//pragma solidity 0.8.11;
//pragma experimental ABIEncoderV2;
//
//import "./libraries/lib.sol";
//import "./libraries/RouterStorageLib.sol";
//
//contract SafeswapRouterForTrade is ISafeswapRouter02{
//
//    event isSwiched(bool newSwitch);
//
//    event RegisterToken(
//        string tokenName,
//        address tokenAddress,
//        address feesAddress,
//        uint256 buyFeePercent,
//        uint256 sellFeePercent,
//        bool isUpdate
//    );
//
//    event UnregisterToken(address tokenAddress);
//
//    function _onlyOwner() private view {
//        require(RouterStorageLib.getAdminAddress() == msg.sender, "Ownable: caller is not the owner");
//    }
//
//    function _ensure(uint256 deadline) private view {
//        require(deadline >= block.timestamp, "SafeswapRouter: EXPIRED");
//    }
//
//    function _onlyRouterTrade() private view {
//        require(msg.sender == RouterStorageLib.getRouterTrade(), "SafeswapRouter: ONLY_ROUTER_TRADE");
//    }
//
//    function _onlyWhitelist() private view {
//        require(RouterStorageLib.getWhitelistAccess(msg.sender), "SafeswapRouter: ONLY_WHITELIST");
//    }
//
//    modifier onlyOwner() {
//        _onlyOwner();
//        _;
//    }
//
//    modifier ensure(uint256 deadline) {
//        _ensure(deadline);
//        _;
//    }
//
//    modifier onlyRouterTrade() {
//        _onlyRouterTrade();
//        _;
//    }
//
//    modifier onlyWhitelist() {
//        _onlyWhitelist();
//        _;
//    }
//
//    receive() external payable {}
//
//    function _swap(
//        uint256[] memory amounts,
//        address[] memory path,
//        address _to
//    ) internal virtual {
//        address factory = RouterStorageLib.getFactoryAddress();
//        for (uint256 i; i < path.length - 1; i++) {
//            (address input, address output) = (path[i], path[i + 1]);
//            (address token0, ) = SafeswapLibrary.sortTokens(input, output);
//            uint256 amountOut = amounts[i + 1];
//            (uint256 amount0Out, uint256 amount1Out) = input == token0
//            ? (uint256(0), amountOut)
//            : (amountOut, uint256(0));
//            address to = i < path.length - 2 ? SafeswapLibrary.pairFor(factory, output, path[i + 2]) : _to;
//            ISafeswapPair(SafeswapLibrary.pairFor(factory, input, output)).swap(
//                amount0Out,
//                amount1Out,
//                to,
//                new bytes(0)
//            );
//        }
//    }
//
//    function swapExactTokensForTokens(
//        uint256 amountIn,
//        uint256 amountOutMin,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//        RouterStorageLib.TokenInfo memory nameToInfo1 = RouterStorageLib.getNameToTokenInfo(path[1]);
//
//        address factory = RouterStorageLib.getFactoryAddress();
//        amounts = SafeswapLibrary.getAmountsOut(factory, amountIn, path);
//        require(amounts[amounts.length - 1] >= amountOutMin, "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
//        // snippet for 'sell' fees !
//        if (
//            nameToInfo0.enabled == true &&
//            killSwitch == false &&
//            (nameToInfo0.sellFeePercent > 0)
//        ) {
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amountIn = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//        amounts = SafeswapLibrary.getAmountsOut(factory, amountIn, path);
//        // same code snippet for 'buy' fees
//        if (nameToInfo1.enabled == true && killSwitch == false && (nameToInfo1.buyFeePercent > 0)) {
//            uint256 amountOut = amounts[amounts.length - 1];
//            uint256 deduction = (amountOut * nameToInfo1.buyFeePercent) / RouterStorageLib.ONE;
//            amountOut = amountOut - deduction;
//            amounts[amounts.length - 1] = amountOut;
//        }
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amounts[0]
//        );
//        _swap(amounts, path, to);
//    }
//
//    function swapTokensForExactTokens(
//        uint256 amountOut,
//        uint256 amountInMax,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address factory = RouterStorageLib.getFactoryAddress();
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//        RouterStorageLib.TokenInfo memory nameToInfo1 = RouterStorageLib.getNameToTokenInfo(path[1]);
//
//        amounts = SafeswapLibrary.getAmountsIn(factory, amountOut, path);
//        require(amounts[0] <= amountInMax, "SafeswapRouter: EXCESSIVE_INPUT_AMOUNT");
//        if (nameToInfo1.enabled == true && killSwitch == false && (nameToInfo1.buyFeePercent > 0)) {
//            uint256 deduction = (amountOut * nameToInfo1.buyFeePercent) / RouterStorageLib.ONE;
//            amountOut = amountOut - deduction;
//        }
//        amounts = SafeswapLibrary.getAmountsIn(factory, amountOut, path);
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 amountIn = amounts[0];
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amounts[0] = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//        amounts = SafeswapLibrary.getAmountsOut(factory, amounts[0], path);
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amounts[0]
//        );
//        _swap(amounts, path, to);
//    }
//
//    function swapExactETHForTokens(
//        uint256 amountOutMin,
//        address[] calldata path,
//        address to,
//        uint256 deadline
//    ) external payable virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[0] == WETH, "SafeswapRouter: INVALID_PATH");
//
//        address factory = RouterStorageLib.getFactoryAddress();
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo1 = RouterStorageLib.getNameToTokenInfo(path[1]);
//
//        amounts = SafeswapLibrary.getAmountsOut(factory, msg.value, path);
//        require(amounts[amounts.length - 1] >= amountOutMin, "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
//        if (nameToInfo1.enabled == true && killSwitch == false && (nameToInfo1.buyFeePercent > 0)) {
//            uint256 amountOut = amounts[amounts.length - 1];
//            uint256 deduction = (amountOut * nameToInfo1.buyFeePercent) / RouterStorageLib.ONE;
//            amounts[amounts.length - 1] = amountOut - deduction;
//        }
//        IWETH(WETH).deposit{ value: amounts[0] }();
//        assert(IWETH(WETH).transfer(SafeswapLibrary.pairFor(factory, path[0], path[1]), amounts[0]));
//        _swap(amounts, path, to);
//    }
//
//    function swapTokensForExactETH(
//        uint256 amountOut,
//        uint256 amountInMax,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[path.length - 1] == WETH, "SafeswapRouter: INVALID_PATH");
//        address factory = RouterStorageLib.getFactoryAddress();
//
//        amounts = SafeswapLibrary.getAmountsIn(factory, amountOut, path);
//        require(amounts[0] <= amountInMax, "SafeswapRouter: EXCESSIVE_INPUT_AMOUNT");
//
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 amountIn = amounts[0];
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amounts[0] = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//        amounts = SafeswapLibrary.getAmountsOut(factory, amounts[0], path);
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amounts[0]
//        );
//        _swap(amounts, path, address(this));
//        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
//        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
//    }
//
//    function swapExactTokensForETH(
//        uint256 amountIn,
//        uint256 amountOutMin,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[path.length - 1] == WETH, "SafeswapRouter: INVALID_PATH");
//
//        address factory = RouterStorageLib.getFactoryAddress();
//        uint256[] memory oldamounts = SafeswapLibrary.getAmountsOut(factory, amountIn, path); // ,amountIn,
//        require(oldamounts[oldamounts.length - 1] >= amountOutMin, "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
//
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amountIn = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//
//        amounts = SafeswapLibrary.getAmountsOut(factory, amountIn, path); // ,amountIn,
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amounts[0] // amouts[0]
//        );
//        _swap(amounts, path, address(this));
//        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
//        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
//    }
//
//    function swapETHForExactTokens(
//        uint256 amountOut,
//        address[] calldata path,
//        address to,
//        uint256 deadline
//    ) external payable virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[0] == WETH, "SafeswapRouter: INVALID_PATH");
//
//        address factory = RouterStorageLib.getFactoryAddress();
//        amounts = SafeswapLibrary.getAmountsIn(factory, amountOut, path);
//        require(amounts[0] <= msg.value, "SafeswapRouter: EXCESSIVE_INPUT_AMOUNT");
//
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo1 = RouterStorageLib.getNameToTokenInfo(path[1]);
//
//        if (nameToInfo1.enabled == true && killSwitch == false && (nameToInfo1.buyFeePercent > 0)) {
//            uint256 deduction = (amountOut * nameToInfo1.buyFeePercent) / RouterStorageLib.ONE;
//            amountOut = amountOut - deduction;
//        }
//        amounts = SafeswapLibrary.getAmountsIn(factory, amountOut, path);
//
//        IWETH(WETH).deposit{ value: amounts[0] }();
//        assert(IWETH(WETH).transfer(SafeswapLibrary.pairFor(factory, path[0], path[1]), amounts[0]));
//        _swap(amounts, path, to);
//        if (msg.value > amounts[0]) TransferHelper.safeTransferETH(to, msg.value - amounts[0]);
//    }
//
//    function _swapSupportingFeeOnTransferTokens(address[] memory path, address _to)
//    internal
//    virtual
//    returns (uint256 amount0Out, uint256 amount1Out)
//    {
//        address factory = RouterStorageLib.getFactoryAddress();
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//
//        for (uint256 i; i < path.length - 1; i++) {
//            (address input, address output) = (path[i], path[i + 1]);
//            (address token0, ) = SafeswapLibrary.sortTokens(input, output);
//            ISafeswapPair pair = ISafeswapPair(SafeswapLibrary.pairFor(factory, input, output));
//            uint256 amountInput;
//            uint256 amountOutput;
//            {
//                // scope to avoid stack too deep errors
//                (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
//                (uint256 reserveInput, uint256 reserveOutput) = input == token0
//                ? (reserve0, reserve1)
//                : (reserve1, reserve0);
//                amountInput = IERC20(input).balanceOf(address(pair)) - reserveInput;
//                amountOutput = SafeswapLibrary.getAmountOut(amountInput, reserveInput, reserveOutput);
//            }
//
//            RouterStorageLib.TokenInfo memory nameToInfo = RouterStorageLib.getNameToTokenInfo(output);
//            if (nameToInfo.enabled == true && killSwitch == false && (nameToInfo.buyFeePercent > 0)) {
//                uint256 deduction = (amountOutput * nameToInfo.buyFeePercent) / RouterStorageLib.ONE;
//                amountOutput = amountOutput - deduction;
//            }
//            (amount0Out, amount1Out) = input == token0 ? (uint256(0), amountOutput) : (amountOutput, uint256(0));
//            address to = i < path.length - 2 ? SafeswapLibrary.pairFor(factory, output, path[i + 2]) : _to;
//            pair.swap(amount0Out, amount1Out, to, new bytes(0));
//        }
//    }
//
//    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
//        uint256 amountIn,
//        uint256 amountOutMin,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist {
//        address factory = RouterStorageLib.getFactoryAddress();
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amountIn = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amountIn
//        );
//        uint256 balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
//        _swapSupportingFeeOnTransferTokens(path, to);
//        require(
//            IERC20(path[path.length - 1]).balanceOf(to) - balanceBefore >= amountOutMin,
//            "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
//        );
//    }
//
//    function swapExactETHForTokensSupportingFeeOnTransferTokens(
//        uint256 amountOutMin,
//        address[] calldata path,
//        address to,
//        uint256 deadline
//    ) external payable virtual override ensure(deadline) onlyWhitelist {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[0] == WETH, "SafeswapRouter: INVALID_PATH");
//        uint256 amountIn = msg.value;
//        IWETH(WETH).deposit{ value: amountIn }();
//
//        address factory = RouterStorageLib.getFactoryAddress();
//        assert(IWETH(WETH).transfer(SafeswapLibrary.pairFor(factory, path[0], path[1]), amountIn));
//        uint256 balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
//        _swapSupportingFeeOnTransferTokens(path, to);
//        require(
//            IERC20(path[path.length - 1]).balanceOf(to) - balanceBefore >= amountOutMin,
//            "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
//        );
//    }
//
//    function swapExactTokensForETHSupportingFeeOnTransferTokens(
//        uint256 amountIn,
//        uint256 amountOutMin,
//        address[] calldata path,
//        address from,
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[path.length - 1] == WETH, "SafeswapRouter: INVALID_PATH");
//
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        address factory = RouterStorageLib.getFactoryAddress();
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amountIn = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], from, nameToInfo0.feesAddress, deduction);
//        }
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            from,
//            SafeswapLibrary.pairFor(factory, path[0], path[1]),
//            amountIn
//        );
//        (uint256 amount0Out, uint256 amount1Out) = _swapSupportingFeeOnTransferTokens(path, address(this));
//        uint256 amountOut = amount0Out > 0 ? amount0Out : amount1Out;
//
//        require(amountOut >= amountOutMin, "SafeswapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
//        IWETH(WETH).withdraw(amountOut);
//        TransferHelper.safeTransferETH(to, amountOut);
//    }
//
//    // **** LIBRARY FUNCTIONS ****
//    function quote(
//        uint256 amountA,
//        uint256 reserveA,
//        uint256 reserveB
//    ) public pure virtual override returns (uint256 amountB) {
//        return SafeswapLibrary.quote(amountA, reserveA, reserveB);
//    }
//
//    function getAmountOut(
//        uint256 amountIn,
//        uint256 reserveIn,
//        uint256 reserveOut
//    ) public pure virtual override returns (uint256 amountOut) {
//        return SafeswapLibrary.getAmountOut(amountIn, reserveIn, reserveOut);
//    }
//
//    function getAmountIn(
//        uint256 amountOut,
//        uint256 reserveIn,
//        uint256 reserveOut
//    ) public pure virtual override returns (uint256 amountIn) {
//        return SafeswapLibrary.getAmountIn(amountOut, reserveIn, reserveOut);
//    }
//
//    function getAmountsOut(uint256 amountIn, address[] memory path)
//    public
//    view
//    virtual
//    override
//    returns (uint256[] memory amounts)
//    {
//        return SafeswapLibrary.getAmountsOut(RouterStorageLib.getFactoryAddress(), amountIn, path);
//    }
//
//    function getAmountsIn(uint256 amountOut, address[] memory path)
//    public
//    view
//    virtual
//    override
//    returns (uint256[] memory amounts)
//    {
//        return SafeswapLibrary.getAmountsIn(RouterStorageLib.getFactoryAddress(), amountOut, path);
//    }
//}
