// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import '../SafeswapERC20.sol';

contract ERC20 is SafeswapERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
