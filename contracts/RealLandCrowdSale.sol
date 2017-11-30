pragma solidity ^0.4.17;

import "./MiniMeToken.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract RealLandCrowdSale is TokenController, Ownable {
  using SafeMath for uint;

  MiniMeToken public tokenContract;

  uint public PRICE = 10; //1 Ether buys 10 RLD
  uint public MIN_PURCHASE = 10**17; // 0.1 Ether
  uint public decimals = 8;
  uint etherRatio = SafeMath.div(1 ether, 10**decimals);

  uint256 public saleStartTime = 1512475200;
  uint256 public saleEndTime = 1517832000;

  uint256 public totalSupply = 70000000 * 10**decimals;

  address public team = 0x03c3CD159170Ab0912Cd00d7cACba79694A32127;
  address public marketting = 0x135B6526943e15fD68EaA05be73f24d641c332D8;
  address public ipoPlatform = 0x8A8eCFDf0eb6f8406C0AD344a6435D6BAf3110e4;
  uint256 public teamPercentage = 38461538461538500000; //% * 10**18
  uint256 public markettingPercentage = 19230769230769200000; //% * 10**18
  uint256 public ipoPlatformPercentage = 42307692307692300000; //% * 10**18
  bool public tokensAllocated = false;

  modifier saleOpen {
    require((getNow() >= saleStartTime) && (getNow() < saleEndTime));
    _;
  }

  modifier saleClosed {
    require(getNow() >= saleEndTime);
    _;
  }

  modifier isMinimum {
    require(msg.value >= MIN_PURCHASE);
    _;
  }

  function RealLandCrowdSale(address _tokenContract) {
    tokenContract = MiniMeToken(_tokenContract);
  }

  function () payable public {
    buyTokens(msg.sender);
  }

  function buyTokens(address _recipient) payable public saleOpen isMinimum {

    //Calculate tokens
    uint tokens = msg.value.mul(PRICE);

    //Add on any bonus
    uint bonus = SafeMath.add(100, bonusPercentage());
    if (bonus != 100) {
      tokens = tokens.mul(percent(bonus)).div(percent(100));
    }

    tokens = tokens.div(etherRatio);

    require(tokenContract.totalSupply().add(tokens) <= bonusCap().mul(10**decimals));

    require(tokenContract.generateTokens(_recipient, tokens));

    //Transfer Ether to owner
    owner.transfer(msg.value);

  }

  function allocateTokens() public onlyOwner saleClosed {
    require(!tokensAllocated);
    tokensAllocated = true;
    uint256 remainingTokens = totalSupply.sub(tokenContract.totalSupply());
    uint256 ipoPlatformTokens = remainingTokens.mul(ipoPlatformPercentage).div(percent(100));
    uint256 markettingTokens = remainingTokens.mul(markettingPercentage).div(percent(100));
    uint256 teamTokens = remainingTokens.sub(ipoPlatformTokens).sub(markettingTokens);
    require(tokenContract.generateTokens(team, teamTokens));
    require(tokenContract.generateTokens(marketting, markettingTokens));
    require(tokenContract.generateTokens(ipoPlatform, ipoPlatformTokens));
  }

  function bonusPercentage() public constant returns(uint256) {

    uint elapsed = SafeMath.sub(getNow(), saleStartTime);

    if (elapsed < 1 weeks) return 25;
    if (elapsed < 2 weeks) return 22;
    if (elapsed < 3 weeks) return 20;
    if (elapsed < 4 weeks) return 17;
    if (elapsed < 5 weeks) return 15;
    if (elapsed < 6 weeks) return 10;
    if (elapsed < 7 weeks) return 7;
    if (elapsed < 8 weeks) return 5;
    if (elapsed < 9 weeks) return 2;

    return 0;

  }

  function bonusCap() public constant returns(uint256) {

    uint elapsed = SafeMath.sub(getNow(), saleStartTime);

    if (elapsed < 1 weeks) return 1000000;
    if (elapsed < 2 weeks) return 3000000;
    if (elapsed < 3 weeks) return 5500000;
    if (elapsed < 4 weeks) return 8500000;
    if (elapsed < 5 weeks) return 12000000;
    if (elapsed < 6 weeks) return 17000000;
    if (elapsed < 7 weeks) return 24000000;
    if (elapsed < 8 weeks) return 36000000;
    if (elapsed < 9 weeks) return 56000000;

    return 70000000;

  }

  function percent(uint256 p) internal returns (uint256) {
    return p.mul(10**18);
  }

  //Function is mocked for tests
  function getNow() internal constant returns (uint256) {
    return now;
  }

  //TokenController implementation

  /// @notice Called when `_owner` sends ether to the MiniMe Token contract
  /// @param _owner The address that sent the ether to create tokens
  /// @return True if the ether is accepted, false if it throws
  function proxyPayment(address _owner) payable public returns(bool) {
    return false;
  }

  /// @notice Notifies the controller about a token transfer allowing the
  ///  controller to react if desired
  /// @param _from The origin of the transfer
  /// @param _to The destination of the transfer
  /// @param _amount The amount of the transfer
  /// @return False if the controller does not authorize the transfer
  function onTransfer(address _from, address _to, uint _amount) public saleClosed returns(bool) {
    return true;
  }

  /// @notice Notifies the controller about an approval allowing the
  ///  controller to react if desired
  /// @param _owner The address that calls `approve()`
  /// @param _spender The spender in the `approve()` call
  /// @param _amount The amount in the `approve()` call
  /// @return False if the controller does not authorize the approval
  function onApprove(address _owner, address _spender, uint _amount) public saleClosed returns(bool) {
    return true;
  }

}
