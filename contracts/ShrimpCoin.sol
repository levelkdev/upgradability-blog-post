pragma solidity ^0.4.18;

import "./StorageConsumer.sol";
import "./Proxy.sol";
import "./DetailedToken.sol";
import "./KeyValueStorage.sol";

contract ShrimpCoin is StorageConsumer, Proxy, DetailedToken {

  function ShrimpCoin(KeyValueStorage storage_)
    public
    StorageConsumer(storage_)
  {
    // set some immutable state
    name = "ShrimpCoin";
    symbol = "SHRMP";
    decimals = 18;

    // set token owner in the key-value store
    storage_.setAddress("owner", msg.sender);
  }

}
