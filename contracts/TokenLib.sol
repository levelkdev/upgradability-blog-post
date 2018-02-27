pragma solidity ^0.4.18;

import "./KeyValueStorage.sol";

library TokenLib {

  function getBalance(KeyValueStorage self, address balanceHolder) public view returns (uint256) {
    return self.getUint(keccak256("balances", balanceHolder));
  }

}