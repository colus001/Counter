pragma solidity ^0.4.23;

contract Counter {
  uint public count = 0;

  function add() external {
    count++;
  }

  function subtract() external {
    count--;
  }
}
