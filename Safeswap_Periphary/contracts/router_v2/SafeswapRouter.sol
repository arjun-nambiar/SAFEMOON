//// SPDX-License-Identifier: MIT
//pragma solidity 0.8.11;
//pragma experimental ABIEncoderV2;
//
//import "./libraries/lib.sol";
//import "./libraries/RouterStorageLib.sol";
//
//contract SafeswapRouterV2 is ISafeswapRouter02Old {
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
//    function setRouterTrade(address _routerTrade) external onlyOwner {
//        RouterStorageLib.setRouterTrade(_routerTrade);
//    }
//
//    function setWhitelist(address _user, bool _status) external onlyOwner {
//        RouterStorageLib.setWhitelistAccess(_user, _status);
//    }
//
//    function getTokenDeduction(address token, uint256 amount) external view returns (uint256, address) {
//        RouterStorageLib.TokenInfo memory tokenInfo = RouterStorageLib.getNameToTokenInfo(token);
//        if (tokenInfo.enabled == false || RouterStorageLib.getKillSwitch() == true)
//            return (0, address(0));
//        uint256 deduction = (amount * tokenInfo.buyFeePercent) / RouterStorageLib.ONE;
//        return (deduction, tokenInfo.feesAddress);
//    }
//
//    function registerToken(
//        string memory tokenName,
//        address tokenAddress,
//        address feesAddress,
//        uint256 buyFeePercent,
//        uint256 sellFeePercent,
//        bool isUpdate
//    ) public onlyOwner {
//        if (!isUpdate) {
//            require(
//                RouterStorageLib.getNameToTokenInfo(tokenAddress).tokenAddress == address(0),
//                "token already exists"
//            );
//            RouterStorageLib.setIdToAddress(RouterStorageLib.getTokensCount(), tokenAddress);
//            uint256 newTokenCount = RouterStorageLib.getTokensCount() + 1;
//            RouterStorageLib.setTokensCount(newTokenCount);
//        } else {
//            require(
//                RouterStorageLib.getNameToTokenInfo(tokenAddress).tokenAddress != address(0),
//                "token does not exist"
//            );
//        }
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).enabled = true;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).isDeleted = false;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).tokenName = tokenName;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).tokenAddress = tokenAddress;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).feesAddress = feesAddress;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).buyFeePercent = buyFeePercent;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).sellFeePercent = sellFeePercent;
//
//        emit RegisterToken(tokenName, tokenAddress, feesAddress, buyFeePercent, sellFeePercent, isUpdate);
//    }
//
//    function unregisterToken(address tokenAddress) external onlyOwner {
//        require(RouterStorageLib.getNameToTokenInfo(tokenAddress).tokenAddress != address(0), "token does not exist");
//        require(RouterStorageLib.getNameToTokenInfo(tokenAddress).isDeleted == false, "token already deleted");
//
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).isDeleted = true;
//        RouterStorageLib.getNameToTokenInfo(tokenAddress).enabled = false;
//
//        emit UnregisterToken(tokenAddress);
//    }
//
//    // function to disable token stp
//    function switchSTPToken(address _tokenAddress) public onlyOwner {
//        require(RouterStorageLib.getNameToTokenInfo(_tokenAddress).isDeleted == false, "token already deleted");
//        RouterStorageLib.getNameToTokenInfo(_tokenAddress).enabled = !RouterStorageLib
//            .getNameToTokenInfo(_tokenAddress)
//            .enabled;
//    }
//
//    function getKillSwitch() public view returns (bool) {
//        return RouterStorageLib.getKillSwitch();
//    }
//
//    function switchSTP() public onlyOwner returns (bool) {
//        bool newKillSwitch = !RouterStorageLib.getKillSwitch();
//        RouterStorageLib.setKillSwitch(newKillSwitch);
//        emit isSwiched(newKillSwitch);
//        return newKillSwitch;
//    }
//
//    function getAllStpTokens() public view returns (RouterStorageLib.TokenInfo[] memory) {
//        uint32 count = 0;
//        uint256 tokenCount = RouterStorageLib.getTokensCount();
//        for (uint256 i = 0; i < tokenCount; i++) {
//            address _token = RouterStorageLib.getIdToAddress(i);
//            if (!RouterStorageLib.getNameToTokenInfo(_token).isDeleted) {
//                count++;
//            }
//        }
//
//        RouterStorageLib.TokenInfo[] memory response = new RouterStorageLib.TokenInfo[](count);
//        uint256 index = 0;
//        for (uint256 i = 0; i < tokenCount; i++) {
//            address _token = RouterStorageLib.getIdToAddress(i);
//            if (!RouterStorageLib.getNameToTokenInfo(_token).isDeleted) {
//                response[index++] = RouterStorageLib.getNameToTokenInfo(_token);
//            }
//        }
//
//        return response;
//    }
//
//    function getTokenSTP(address _tokenAddress) public view returns (RouterStorageLib.TokenInfo memory) {
//        return RouterStorageLib.getNameToTokenInfo(_tokenAddress);
//    }
//
//    // **** ADD LIQUIDITY ****
//    function _addLiquidity(
//        address tokenA,
//        address tokenB,
//        uint256 amountADesired,
//        uint256 amountBDesired,
//        uint256 amountAMin,
//        uint256 amountBMin,
//        address to
//    ) internal virtual returns (uint256 amountA, uint256 amountB) {
//        // create the pair if it doesn't exist yet
//        address factory = RouterStorageLib.getFactoryAddress();
//        if (ISafeswapFactory(factory).getPair(tokenA, tokenB) == address(0)) {
//            ISafeswapFactory(factory).createPair(tokenA, tokenB, to);
//        }
//        (uint256 reserveA, uint256 reserveB) = SafeswapLibrary.getReserves(factory, tokenA, tokenB);
//        if (reserveA == 0 && reserveB == 0) {
//            (amountA, amountB) = (amountADesired, amountBDesired);
//        } else {
//            uint256 amountBOptimal = SafeswapLibrary.quote(amountADesired, reserveA, reserveB);
//            if (amountBOptimal <= amountBDesired) {
//                require(amountBOptimal >= amountBMin, "SafeswapRouter: INSUFFICIENT_B_AMOUNT");
//                (amountA, amountB) = (amountADesired, amountBOptimal);
//            } else {
//                uint256 amountAOptimal = SafeswapLibrary.quote(amountBDesired, reserveB, reserveA);
//                assert(amountAOptimal <= amountADesired);
//                require(amountAOptimal >= amountAMin, "SafeswapRouter: INSUFFICIENT_A_AMOUNT");
//                (amountA, amountB) = (amountAOptimal, amountBDesired);
//            }
//        }
//    }
//
//    function addLiquidity(
//        address tokenA,
//        address tokenB,
//        uint256 amountADesired,
//        uint256 amountBDesired,
//        uint256 amountAMin,
//        uint256 amountBMin,
//        address to,
//        uint256 deadline
//    )
//        external
//        virtual
//        override
//        ensure(deadline)
//        returns (
//            uint256 amountA,
//            uint256 amountB,
//            uint256 liquidity
//        )
//    {
//        address factory = RouterStorageLib.getFactoryAddress();
//        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to);
//        address pair = SafeswapLibrary.pairFor(factory, tokenA, tokenB);
//        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
//        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
//        liquidity = ISafeswapPair(pair).mint(to);
//    }
//
//    function addLiquidityETH(
//        address token,
//        uint256 amountTokenDesired,
//        uint256 amountTokenMin,
//        uint256 amountETHMin,
//        address to,
//        uint256 deadline
//    )
//        external
//        payable
//        virtual
//        override
//        ensure(deadline)
//        returns (
//            uint256 amountToken,
//            uint256 amountETH,
//            uint256 liquidity
//        )
//    {
//        address factory = RouterStorageLib.getFactoryAddress();
//        address WETH = RouterStorageLib.getWETHAddress();
//        (amountToken, amountETH) = _addLiquidity(
//            token,
//            WETH,
//            amountTokenDesired,
//            msg.value,
//            amountTokenMin,
//            amountETHMin,
//            to
//        );
//        address pair = SafeswapLibrary.pairFor(factory, token, WETH);
//        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountToken);
//        IWETH(WETH).deposit{ value: amountETH }();
//        assert(IWETH(WETH).transfer(pair, amountETH));
//        liquidity = ISafeswapPair(pair).mint(to);
//        // refund dust eth, if any
//        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);
//    }
//
//    // **** REMOVE LIQUIDITY ****
//    function removeLiquidity(
//        address tokenA,
//        address tokenB,
//        uint256 liquidity,
//        uint256 amountAMin,
//        uint256 amountBMin,
//        address to,
//        uint256 deadline
//    ) public virtual override ensure(deadline) returns (uint256 amountA, uint256 amountB) {
//        address factory = RouterStorageLib.getFactoryAddress();
//        address pair = SafeswapLibrary.pairFor(factory, tokenA, tokenB);
//        ISafeswapPair(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
//        (uint256 amount0, uint256 amount1) = ISafeswapPair(pair).burn(to);
//        (address token0, ) = SafeswapLibrary.sortTokens(tokenA, tokenB);
//        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
//        require(amountA >= amountAMin, "SafeswapRouter: INSUFFICIENT_A_AMOUNT");
//        require(amountB >= amountBMin, "SafeswapRouter: INSUFFICIENT_B_AMOUNT");
//    }
//
//    function removeLiquidityETH(
//        address token,
//        uint256 liquidity,
//        uint256 amountTokenMin,
//        uint256 amountETHMin,
//        address to,
//        uint256 deadline
//    ) public virtual override ensure(deadline) returns (uint256 amountToken, uint256 amountETH) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        (amountToken, amountETH) = removeLiquidity(
//            token,
//            WETH,
//            liquidity,
//            amountTokenMin,
//            amountETHMin,
//            address(this),
//            deadline
//        );
//        IWETH(WETH).withdraw(amountETH);
//        TransferHelper.safeTransferETH(to, amountETH);
//        TransferHelper.safeTransfer(token, to, amountToken);
//    }
//
//    function removeLiquidityWithPermit(
//        address tokenA,
//        address tokenB,
//        uint256 liquidity,
//        uint256 amountAMin,
//        uint256 amountBMin,
//        address to,
//        uint256 deadline,
//        bool approveMax,
//        uint8 v,
//        bytes32 r,
//        bytes32 s
//    ) external virtual override returns (uint256 amountA, uint256 amountB) {
//        address factory = RouterStorageLib.getFactoryAddress();
//        address pair = SafeswapLibrary.pairFor(factory, tokenA, tokenB);
//        uint256 value = approveMax ? type(uint256).max : liquidity;
//        ISafeswapPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
//        (amountA, amountB) = removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
//    }
//
//    function removeLiquidityETHWithPermit(
//        address token,
//        uint256 liquidity,
//        uint256 amountTokenMin,
//        uint256 amountETHMin,
//        address to,
//        uint256 deadline,
//        bool approveMax,
//        uint8 v,
//        bytes32 r,
//        bytes32 s
//    ) external virtual override returns (uint256 amountToken, uint256 amountETH) {
//        address factory = RouterStorageLib.getFactoryAddress();
//        address WETH = RouterStorageLib.getWETHAddress();
//        address pair = SafeswapLibrary.pairFor(factory, token, WETH);
//        uint256 value = approveMax ? type(uint256).max : liquidity;
//        ISafeswapPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
//        (amountToken, amountETH) = removeLiquidityETH(token, liquidity, amountTokenMin, amountETHMin, to, deadline);
//    }
//
//    // **** REMOVE LIQUIDITY (supporting fee-on-transfer tokens) ****
//    function removeLiquidityETHSupportingFeeOnTransferTokens(
//        address token,
//        uint256 liquidity,
//        uint256 amountTokenMin,
//        uint256 amountETHMin,
//        address to,
//        uint256 deadline
//    ) public virtual override ensure(deadline) returns (uint256 amountETH) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        (, amountETH) = removeLiquidity(token, WETH, liquidity, amountTokenMin, amountETHMin, address(this), deadline);
//        IWETH(WETH).withdraw(amountETH);
//        TransferHelper.safeTransferETH(to, amountETH);
//        TransferHelper.safeTransfer(token, to, IERC20(token).balanceOf(address(this)));
//    }
//
//    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
//        address token,
//        uint256 liquidity,
//        uint256 amountTokenMin,
//        uint256 amountETHMin,
//        address to,
//        uint256 deadline,
//        bool approveMax,
//        uint8 v,
//        bytes32 r,
//        bytes32 s
//    ) external virtual override returns (uint256 amountETH) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        address pair = SafeswapLibrary.pairFor(RouterStorageLib.getFactoryAddress(), token, WETH);
//        uint256 value = approveMax ? type(uint256).max : liquidity;
//        ISafeswapPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
//        amountETH = removeLiquidityETHSupportingFeeOnTransferTokens(
//            token,
//            liquidity,
//            amountTokenMin,
//            amountETHMin,
//            to,
//            deadline
//        );
//    }
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
//                ? (uint256(0), amountOut)
//                : (amountOut, uint256(0));
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
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
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
//            msg.sender,
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
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
//        }
//        amounts = SafeswapLibrary.getAmountsOut(factory, amounts[0], path);
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            msg.sender,
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
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
//        }
//        amounts = SafeswapLibrary.getAmountsOut(factory, amounts[0], path);
//        TransferHelper.safeTransferFrom(
//            path[0],
//            msg.sender,
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
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist returns (uint256[] memory amounts) {
//        address WETH = RouterStorageLib.getWETHAddress();
//        require(path[path.length - 1] == WETH, "SafeswapRouter: INVALID_PATH");
//        address[] memory pathClone = path;
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
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
//        }
//
//        amounts = SafeswapLibrary.getAmountsOut(factory, amountIn, path); // ,amountIn,
//
//        TransferHelper.safeTransferFrom(
//            pathClone[0],
//            msg.sender,
//            SafeswapLibrary.pairFor(factory, pathClone[0], pathClone[1]),
//            amounts[0] // amouts[0]
//        );
//        _swap(amounts, pathClone, address(this));
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
//        internal
//        virtual
//        returns (uint256 amount0Out, uint256 amount1Out)
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
//                    ? (reserve0, reserve1)
//                    : (reserve1, reserve0);
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
//        address to,
//        uint256 deadline
//    ) external virtual override ensure(deadline) onlyWhitelist {
//        address factory = RouterStorageLib.getFactoryAddress();
//        bool killSwitch = RouterStorageLib.getKillSwitch();
//        RouterStorageLib.TokenInfo memory nameToInfo0 = RouterStorageLib.getNameToTokenInfo(path[0]);
//        if (nameToInfo0.enabled == true && killSwitch == false && (nameToInfo0.sellFeePercent > 0)) {
//            uint256 deduction = (amountIn * nameToInfo0.sellFeePercent) / RouterStorageLib.ONE;
//            amountIn = amountIn - deduction;
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
//        }
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            msg.sender,
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
//            TransferHelper.safeTransferFrom(path[0], msg.sender, nameToInfo0.feesAddress, deduction);
//        }
//
//        TransferHelper.safeTransferFrom(
//            path[0],
//            msg.sender,
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
//        public
//        view
//        virtual
//        override
//        returns (uint256[] memory amounts)
//    {
//        return SafeswapLibrary.getAmountsOut(RouterStorageLib.getFactoryAddress(), amountIn, path);
//    }
//
//    function getAmountsIn(uint256 amountOut, address[] memory path)
//        public
//        view
//        virtual
//        override
//        returns (uint256[] memory amounts)
//    {
//        return SafeswapLibrary.getAmountsIn(RouterStorageLib.getFactoryAddress(), amountOut, path);
//    }
//}
