pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Counter.sol";

contract TestCounter {
  function testContractHasDeployed() public {
    Counter counter = Counter(DeployedAddresses.Counter());

    uint expected = 0;

    Assert.equal(counter.count(), expected, "Counter count is not zero");
  }
}
