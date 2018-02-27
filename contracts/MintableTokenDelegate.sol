pragma solidity ^0.4.18;

import "./TokenDelegate.sol";

contract MintableTokenDelegate is TokenDelegate {

  modifier onlyOwner {
    require(msg.sender == _storage.getAddress("owner"));
    _;
  }
  
  modifier canMint() {
    require(!_storage.getBool("mintingFinished"));
    _;
  }

  function mint(address to, uint256 amount) onlyOwner canMint public returns (bool) {
    addSupply(amount);
    addBalance(to, amount);
    return true;
  }

  function finishMinting() onlyOwner canMint public returns (bool) {
    _storage.setBool("mintingFinished", true);
    return true;
  }

}