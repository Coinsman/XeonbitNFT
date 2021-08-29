// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Checker {

  function _checkBalERC20(address token, address holder) public payable returns(uint) {
    IERC20 token = IERC20(token);
    return token.balanceOf(holder);
  }
}