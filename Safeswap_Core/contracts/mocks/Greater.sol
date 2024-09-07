// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract Greater {
    uint256 public __nothing;
    uint256 public count;
    mapping(uint256 => uint256) public balance;

    function increase() external {
        count++;
    }

    function decrease() external {
        count--;
    }

    function setBalance(uint256 _id, uint256 _balance) external {
        balance[_id] = _balance;
    }

    function doSomethingWithCount() external {
        count += 5;
    }
}

contract NewGreater {
    uint256 public __nothing;
    uint256 public count;
    mapping(uint256 => uint256) public balance;

    function increase() external {
        count++;
    }

    function decrease() external {
        count--;
    }

    function setBalance(uint256 _id, uint256 _balance) external {
        balance[_id] = _balance;
    }

    function doSomethingWithCount() external {
        count += 10;
    }
}
