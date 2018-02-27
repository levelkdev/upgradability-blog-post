pragma solidity ^0.4.18;

import "./KeyValueStorage.sol";
import "./StorageStateful.sol";

contract StorageConsumer is StorageStateful {
  function StorageConsumer(KeyValueStorage storage_) public {
    _storage = storage_;
  }
}
