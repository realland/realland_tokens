pragma solidity ^0.4.17;

import "./MiniMeToken.sol";

contract RealLandToken is MiniMeToken {

  function RealLandToken(address _tokenFactory)
    MiniMeToken(
      _tokenFactory,
      0x0,                     // no parent token
      0,                       // no snapshot block number from parent
      "RealLand Token",           // Token name
      8,                       // Decimals
      "RLD",                   // Symbol
      true                    // Enable transfers
    )
  {}

}
