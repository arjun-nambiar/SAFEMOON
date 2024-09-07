// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() ERC20("reward", "rw") {
        _mint(msg.sender, 10000000000000000000000 * 10**decimals());
    }
}
