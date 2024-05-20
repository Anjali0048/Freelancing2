// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FreelanceToken is ERC20, Ownable {
    constructor() ERC20("FreelanceToken", "FLT") Ownable(msg.sender) {
        // Ownership is set to msg.sender explicitly in the Ownable constructor
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}