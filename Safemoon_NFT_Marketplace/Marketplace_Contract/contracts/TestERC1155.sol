
// SPDX-License-Identifier: MIT

pragma solidity >=0.6.9 <0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
// import "@rarible/lazy-mint/contracts/erc-1155/LibERC1155LazyMint.sol";

contract ERC1155Test is ERC1155Upgradeable {

    uint256 public tokenId;

    function mint(uint256 _qtyMint) public {

        tokenId++;

        _mint(msg.sender, tokenId, _qtyMint, "0x");
    }
 
}