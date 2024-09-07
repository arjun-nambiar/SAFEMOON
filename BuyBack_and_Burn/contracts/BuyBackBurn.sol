// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interface/IUniswapV2Router02.sol";
import "./interface/ITradeRouter.sol";
import "./interface/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BuyBackBurn is Initializable, OwnableUpgradeable {
    address constant BURN = 0x000000000000000000000000000000000000dEaD;
    address public tradeRouter;
    address public sfmTokenAddress;
    uint256 public threshold;

    event ChangeSFMAddress(address token);
    event ChangeThreshold(uint256 amount);
    event ChangeRouter(address router);

    function initialize(
        uint256 _threshold,
        address _tradeRouter,
        address _sfmToken
    ) external initializer {
        threshold = _threshold;
        tradeRouter = _tradeRouter;
        sfmTokenAddress = _sfmToken;
        __Ownable_init();
    }

    receive() external payable {
        buyBackAndBurn();
    }

    function buyBackAndBurn() public payable {
        uint256 total = address(this).balance;
        if (total >= threshold && threshold > 0) {
            uint256 times = total / threshold;
            uint256 bnbSwapAmount = threshold * times;
            _swap(bnbSwapAmount);
            _burn();
        }
    }

    function _swap(uint256 tokenAmount) private {
        address router = ITradeRouter(tradeRouter).swapRouter();
        address[] memory path = new address[](2);
        path[1] = sfmTokenAddress;
        path[0] = IUniswapV2Router02(router).WETH();
        uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(tokenAmount, path);
        ITradeRouter.Trade memory newTrade = ITradeRouter.Trade(
            {
                amountIn: tokenAmount,
                amountOut: amounts[1],
                path: path,
                to: payable(address(this)),
                deadline: block.timestamp
            }
        );
        // make the swap
        ITradeRouter(tradeRouter).swapExactETHForTokensWithFeeAmount{ value: tokenAmount }(
            newTrade,
            0
        );
    }

    function _burn() private {
        uint256 balance = IERC20(sfmTokenAddress).balanceOf(address(this));
        IERC20(sfmTokenAddress).transfer(BURN, balance);
    }

    function changeSFMToken(address _token) public onlyOwner {
        sfmTokenAddress = _token;
        emit ChangeSFMAddress(_token);
    }

    function changeRouter(address _tradeRouter) public onlyOwner {
        tradeRouter = _tradeRouter;
        emit ChangeRouter(_tradeRouter);
    }

    function changeThreshold(uint256 _threshold) public onlyOwner {
        threshold = _threshold;
        emit ChangeThreshold(_threshold);
    }
}