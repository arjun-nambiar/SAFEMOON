// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./SafeMath.sol";
import "./IERC20.sol";
import "./SafeERC20.sol";
import "./MasterChef.sol";
import "./ISafeswapFactory.sol";
import "./ISafeswapRouter.sol";

contract Trade {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Address of Staking contract
    address public masterChef;
    // The SFM TOKEN!
    address public sfm;
    // SafemoonReward Growth Fund
    address public growthFund;
    address public owner;

    mapping(address => address) public referrerOf;


    function initialize(address _sfm,
        address _growthFund,
        address _masterChef)public {
            sfm = _sfm;
            owner = msg.sender;
            growthFund = _growthFund;
            masterChef = _masterChef;
    }

    // Need to call this when signing up to cosmipay using a paylink
    function setReferrer(address _paylinkHolder) public {
        referrerOf[msg.sender] = _paylinkHolder;
    }

    /*
     * Accept incoming payment from the buyer
     *
     * Deduct fees as per business model
     *
     * Send the tokens to the seller, fund growth, referrer & buyer
     */
    function sendTokens(
        address _token,
        uint256 _amount,
        address payable _to
    ) external payable {
        if (_token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            // ** IMPORTANT ** _amount = 0;
            uint256 amount = msg.value;
            // funtion to handle bnb transaction
            bnbTransaction(_token, amount, _to);
        }

        else if(_token == sfm){
            require(
                IERC20(_token).balanceOf(msg.sender) >= _amount,
                "!! Balance not enough !!"
            );
            require(
                IERC20(_token).allowance(msg.sender, address(this)) >= _amount,
                "!! Increase my _allowance_ OR _approve_ my spending limit !!"
            );
            sfmTransaction(_token, _amount, _to);
        }
        
        else {
            require(
                IERC20(_token).balanceOf(msg.sender) >= _amount,
                "!! Balance not enough !!"
            );
            require(
                IERC20(_token).allowance(msg.sender, address(this)) >= _amount,
                "!! Increase my _allowance_ OR _approve_ my spending limit !!"
            );
            // funtion to handle token transaction
            tokenTransaction(_token, _amount, _to);
        }
    }

    function ethForTokens(uint256 amt)
        internal
        returns (uint256[] memory output)
    {
        address[] memory path = new address[](2);
        path[0] = address(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        path[1] = sfm;

        uint256 deadline = block.timestamp.add(500);

        ISafeswapRouter02 sr =
            ISafeswapRouter02(0xcE5954658526b7Cf6B5040b3Ef2D9B4F8C30b8B0);

        uint256[] memory amounts =
            sr.swapExactETHForTokens{value: amt}(
                0,
                path,
                address(this),
                deadline
            );
        return amounts;
    }

    function bnbTransaction(address token, uint256 amount, address payable seller) internal {
        // Pancake Interface
        ISafeswapFactory sf =
            ISafeswapFactory(0x209fa0e6b6c38Dab1afb4380AceC186b5E884f9B);

        // check if (BNB/SFM) pair present in pancakeswap
        address pair =
            sf.getPair(sfm, 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        require(pair != address(0), "!! BNB/SFM pair not found !!");

        bool sellerStake = isSellerStaking(token, amount, seller);
        bool refStake = isReferrerStaking(token, amount, seller);

        address ref = referrerOf[seller];

        // 99% of amount
        uint256 amt99 = amount.mul(99).div(100);
        // 98% of amount
        uint256 amt98 = amount.mul(98).div(100);
        // Pending 1% of amount
        uint256 pendingAmt1 = amount.sub(amt99);
        // Pending 2% of amount
        uint256 pendingAmt2 = amount.sub(amt98);

        if (sellerStake && refStake) {
            // 99 % to seller
            seller.transfer(amt99);

            // swap Exact BNB For Tokens
            uint256[] memory output = ethForTokens(pendingAmt1);
            require(
                output[1] != 0,
                "!! Recieved 0 sfm tokens from pancake !!"
            );
            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));
            //send 0.5% to buyer and referrer each
            uint256 amt = tokAmt.div(2);
            uint256 amtLeftover = tokAmt.sub(amt);
            IERC20(sfm).transfer(msg.sender, amt);
            IERC20(sfm).transfer(ref, amtLeftover);

        } else if (sellerStake && !refStake) {
            // 99 % to seller
            seller.transfer(amt99);

            // swap Exact BNB For Tokens
            uint256[] memory output = ethForTokens(pendingAmt1);
            require(
                output[1] != 0,
                "!! Recieved 0 sfm tokens from safeswap !!"
            );

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));

            //send 0.5% to buyer
            uint256 amt = tokAmt.div(2);
            IERC20(sfm).transfer(msg.sender, amt);

            // Burn 0.25% sfm tokens
            // Deposit 0.25% to fund growth
            uint256 amtLeftover = tokAmt.sub(amt);
            uint256 amtLeft1 = amtLeftover.div(2);
            uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
            IERC20(sfm).transfer(growthFund, amtLeft1);
            IERC20(sfm).transfer(0x000000000000000000000000000000000000dEaD,amtLeft2);

        } else if (!sellerStake && refStake) {
            // 98 % to seller
            seller.transfer(amt98);

            // swap Exact BNB For Tokens
            uint256[] memory output = ethForTokens(pendingAmt2);
            require(
                output[1] != 0,
                "!! Recieved 0 sfm tokens from pancake !!"
            );

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));

            //send 1% to buyer and referrer each
            uint256 amt = tokAmt.div(2);
            uint256 amtLeftover = tokAmt.sub(amt);
            IERC20(sfm).transfer(msg.sender, amt);
            IERC20(sfm).transfer(ref, amtLeftover);

        } else {
            // (!sellerStake && !refStake)

            // 98 % to seller
            seller.transfer(amt98);

            // swap Exact BNB For Tokens
            uint256[] memory output = ethForTokens(pendingAmt2);
            require(
                output[1] != 0,
                "!! Recieved 0 sfm tokens from safeswap !!"
            );

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));

            //send 1% to buyer
            uint256 amt = tokAmt.div(2);
            // Burn 0.5% sfm tokens
            // Deposit 0.5% to fund growth
            uint256 amtLeftover = tokAmt.sub(amt);
            uint256 amtLeft1 = amtLeftover.div(2);
            uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
            IERC20(sfm).transfer(msg.sender, amt);
            IERC20(sfm).transfer(growthFund, amtLeft1);
            IERC20(sfm).transfer(0x000000000000000000000000000000000000dEaD,amtLeft2);
        }
    }

     function sfmTransaction(
        address token,
        uint256 amount,
        address seller
    ) internal {
        // Pancake Interface
        ISafeswapFactory sf =
            ISafeswapFactory(0x209fa0e6b6c38Dab1afb4380AceC186b5E884f9B);

        // check if (BNB/SFM) pair present in pancakeswap
        address pair2 =
            sf.getPair(sfm, 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        require(pair2 != address(0), "!! BNB/SFM pair not found !!");

        bool sellerStake = isSellerStaking(token, amount, seller);
        bool refStake = isReferrerStaking(token, amount, seller);

        address ref = referrerOf[seller];

        // 99% of amount
        uint256 amt99 = amount.mul(99).div(100);
        // 98% of amount
        uint256 amt98 = amount.mul(98).div(100);
        // Pending 1% of amount
        uint256 pendingAmt1 = amount.sub(amt99);
        // Pending 2% of amount
        uint256 pendingAmt2 = amount.sub(amt98);

        if (sellerStake && refStake) {
            // 99 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt99);

            // send 0.5% to buyer and referrer each
            uint256 amt = pendingAmt1.div(2);
            IERC20(sfm).transferFrom(msg.sender,msg.sender, amt);
            IERC20(sfm).transferFrom(msg.sender,ref, amt);

        } else if (sellerStake && !refStake) {
            // 99 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt99);

            // send 0.5% to buyer
            uint256 amt = pendingAmt1.div(2);
            IERC20(sfm).transferFrom(msg.sender,msg.sender, amt);
            // Burn 0.25% sfm tokens
            // Deposit 0.25% to fund growth
            uint256 amtLeftover = pendingAmt1.sub(amt);
            uint256 amtLeft1 = amtLeftover.div(2);
            uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
            IERC20(sfm).transferFrom(msg.sender,growthFund, amtLeft1);
            IERC20(sfm).transferFrom(msg.sender,0x000000000000000000000000000000000000dEaD,amtLeft2);

        } else if (!sellerStake && refStake) {
            // 98 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt98);

            // send 1% to buyer and referrer each
            uint256 amt = pendingAmt2.div(2);
            uint256 amtLeftover = pendingAmt2.sub(amt);
            IERC20(sfm).transferFrom(msg.sender,msg.sender, amt);
            IERC20(sfm).transferFrom(msg.sender,ref, amtLeftover);

        } else {
            // (!sellerStake && !refStake)
            // 98 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt98);

            // send 1% to buyer
            uint256 amt = pendingAmt2.div(2);
            IERC20(sfm).transferFrom(msg.sender,msg.sender, amt);
            //Burn 0.5% cosmi tokens
            // Deposit 0.5% to fund growth
             uint256 amtLeftover = pendingAmt2.sub(amt);
             uint256 amtLeft1 = amtLeftover.div(2);
             uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
             IERC20(sfm).transferFrom(msg.sender,growthFund, amtLeft1);
             IERC20(sfm).transferFrom(msg.sender,0x000000000000000000000000000000000000dEaD,amtLeft2);
        }
    }



    function tokensForTokens(address token, uint256 amt)
        internal
    {
        address[] memory path = new address[](3);
        path[0] = token;
        path[1] = address(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        path[2] = sfm;

        uint256 deadline = block.timestamp.add(500);
        IERC20(token).transferFrom(msg.sender, address(this), amt);
        IERC20(token).approve(0xcE5954658526b7Cf6B5040b3Ef2D9B4F8C30b8B0, amt);

        ISafeswapRouter02 sr =
            ISafeswapRouter02(0xcE5954658526b7Cf6B5040b3Ef2D9B4F8C30b8B0);

            sr.swapExactTokensForTokensSupportingFeeOnTransferTokens(IERC20(token).balanceOf(address(this)), 0, path, address(this), deadline);

    }

    function tokenTransaction(
        address token,
        uint256 amount,
        address seller
    ) internal {
        // Pancake Interface
        ISafeswapFactory sf =
            ISafeswapFactory(0x209fa0e6b6c38Dab1afb4380AceC186b5E884f9B);

        // check if (BNB/'Token sent by buyer') pair present in pancakeswap
        address pair1 =
            sf.getPair(token, 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        require(
            pair1 != address(0),
            "!! BNB/'Token sent by buyer' pair not found !!"
        );

        // check if (BNB/SFM) pair present in pancakeswap
        address pair2 =
            sf.getPair(sfm, 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        require(pair2 != address(0), "!! BNB/SFM pair not found !!");

        bool sellerStake = isSellerStaking(token, amount, seller);
        bool refStake = isReferrerStaking(token, amount, seller);

        address ref = referrerOf[seller];

        // 99% of amount
        uint256 amt99 = amount.mul(99).div(100);
        // 98% of amount
        uint256 amt98 = amount.mul(98).div(100);
        // Pending 1% of amount
        uint256 pendingAmt1 = amount.sub(amt99);
        // Pending 2% of amount
        uint256 pendingAmt2 = amount.sub(amt98);

        if (sellerStake && refStake) {
            // 99 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt99);
            // swapping incoming token with SFM
             tokensForTokens(token, pendingAmt1);

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));
            // send 0.5% to buyer and referrer each
            uint256 amt = tokAmt.div(2);
            uint256 amtLeftover = tokAmt.sub(amt);
            IERC20(sfm).transfer(msg.sender, amt);
            IERC20(sfm).transfer(ref, amtLeftover);

        } else if (sellerStake && !refStake) {
            // 99 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt99);
            // swapping incoming token with Cosmi
            tokensForTokens(token, pendingAmt1);

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));
            // send 0.5% to buyer
            uint256 amt = tokAmt.div(2);
            IERC20(sfm).transfer(msg.sender, amt);
            // Burn 0.25% sfm tokens
            // Deposit 0.25% to fund growth
            uint256 amtLeftover = tokAmt.sub(amt);
            uint256 amtLeft1 = amtLeftover.div(2);
            uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
            IERC20(sfm).transfer(growthFund, amtLeft1);
            IERC20(sfm).transfer(0x000000000000000000000000000000000000dEaD,amtLeft2);

        } else if (!sellerStake && refStake) {
            // 98 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt98);
            // swapping incoming token with Cosmi
            tokensForTokens(token, pendingAmt2);

            uint256 tokAmt = IERC20(sfm).balanceOf(address(this));
            // send 1% to buyer and referrer each
            uint256 amt = tokAmt.div(2);
            uint256 amtLeftover = tokAmt.sub(amt);
            IERC20(sfm).transfer(msg.sender, amt);
            IERC20(sfm).transfer(ref, amtLeftover);

        } else {
            // (!sellerStake && !refStake)
            // 98 % to seller
            IERC20(token).transferFrom(msg.sender, seller, amt98);
            // swapping incoming token with Cosmi
            tokensForTokens(token, pendingAmt2);

             uint256 tokAmt = IERC20(sfm).balanceOf(address(this));
            // send 1% to buyer
            uint256 amt = tokAmt.div(2);
            IERC20(sfm).transfer(msg.sender, amt);
            // Burn 0.5% cosmi tokens
            // Deposit 0.5% to fund growth
            uint256 amtLeftover = tokAmt.sub(amt);
            uint256 amtLeft1 = amtLeftover.div(2);
            uint256 amtLeft2 = amtLeftover.sub(amtLeft1);
            IERC20(sfm).transfer(growthFund, amtLeft1);
            IERC20(sfm).transfer(0x000000000000000000000000000000000000dEaD,amtLeft2);
        }
    }

    function amountsOut(address token, uint256 amount)
        internal
        view
        returns (uint256[] memory output)
    {
        address[] memory pathbnb = new address[](2);
        pathbnb[0] = address(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        pathbnb[1] = sfm;

        address[] memory path = new address[](3);
        path[0] = token;
        path[1] = address(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);
        path[2] = sfm;

        ISafeswapRouter02 sr =
            ISafeswapRouter02(0xcE5954658526b7Cf6B5040b3Ef2D9B4F8C30b8B0);

        if (token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            uint256[] memory amounts = sr.getAmountsOut(amount, pathbnb);
            return amounts;
        } else {
            uint256[] memory amounts = sr.getAmountsOut(amount, path);
            return amounts;
        }
    }

    // Check if seller is staking 1.5% cosmi tokens of the amount sent by the buyer
    function isSellerStaking(address token, uint256 amount, address seller)
        public
        view
        returns (bool)
    {
        uint256 amt;
        uint256[] memory output = amountsOut(token, amount);
        MasterChef mc = MasterChef(masterChef);
        uint256 sellerStakeAmount = mc.userStakingAmount(seller);

        if (token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            amt = output[1].mul(15).div(1000);
        } else {
            amt = output[2].mul(15).div(1000);
        }

        if (sellerStakeAmount >= amt) {
            return true;
        } else {
            return false;
        }
    }

    // Check if referrer has staked 150% of 0.5% of amount buyer sends
    function isReferrerStaking(address token, uint256 amount, address seller)
        public
        view
        returns (bool)
    {
        uint256 amt;
        uint256[] memory output = amountsOut(token, amount);
        MasterChef mc = MasterChef(masterChef);
        require(
                referrerOf[seller] != address(0),
                "!! Referrer dosen't exist !!"
            );
        address ref = referrerOf[seller];
        uint256 referrerStakeAmount = mc.userStakingAmount(ref);

        if (token == 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
            amt = output[1].mul(5).div(1000);
        } else {
            amt = output[2].mul(5).div(1000);
        }

        uint256 amtb = amt.mul(15).div(10);
        if (referrerStakeAmount >= amtb) {
            return true;
        } else {
            return false;
        }
    }
}