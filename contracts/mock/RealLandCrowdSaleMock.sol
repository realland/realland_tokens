pragma solidity ^0.4.15;

import '../RealLandCrowdSale.sol';

contract RealLandCrowdSaleMock is RealLandCrowdSale {

  event MockNow(uint _now);

  uint mock_now = 1;

  function RealLandCrowdSaleMock(address _tokenContract)
    RealLandCrowdSale(_tokenContract)
  {}

  function getNow() internal constant returns (uint) {
      return mock_now;
  }

  function setMockedNow(uint _b) public {
      mock_now = _b;
      MockNow(_b);
  }

}
