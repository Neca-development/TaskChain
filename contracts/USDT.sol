// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("USDT", "USDT") {
        _mint(msg.sender, 1000_000_000 * (10 ** decimals()));
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
