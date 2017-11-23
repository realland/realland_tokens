const BigNumber = require('bignumber.js');
const RealLandToken = artifacts.require("./RealLandToken.sol");
const RealLandCrowdSale = artifacts.require("./RealLandCrowdSaleMock.sol");

const assertFail = require("./helpers/assertFail");

contract('Check ICO Sale', function (accounts) {

  var saleStartTime = 1512129600;
  var saleEndTime = 1517400000;

  var OWNER = accounts[0];
  var TEAM = "0x03c3CD159170Ab0912Cd00d7cACba79694A32127";
  var MARKETTING = "0x135B6526943e15fD68EaA05be73f24d641c332D8";
  var IPO_PLATFORM = "0x8A8eCFDf0eb6f8406C0AD344a6435D6BAf3110e4";
  var TOKENSDEC = 10**8;
  var WEEK = 7 * 24 * 60 * 60;
  var investor_1 = accounts[1];
  var investor_2 = accounts[2];
  var investor_3 = accounts[3];
  var investor_4 = accounts[4];
  var investor_5 = accounts[5];
  var investor_6 = accounts[6];
  var investor_7 = accounts[7];

  var initialWalletBalance = web3.eth.getBalance(OWNER);

  it("0. send some contributions", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();
    await realLandCrowdSale.setMockedNow(saleStartTime);

    var owner_start_balance = web3.eth.getBalance(OWNER);
    await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(1, 'ether')});

    var investor_1_balance = await realLandToken.balanceOf(investor_1);
    assert.equal(investor_1_balance.toNumber(), 1.25 * 10 * TOKENSDEC, "Investor 1 should have 25% bonus");
    var owner_end_balance = web3.eth.getBalance(OWNER);
    assert.equal(owner_end_balance.sub(owner_start_balance).toNumber(), 10**18, "OWNER receives funds");
  });

  it("1. send some more contributions", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(80000 - 1, 'ether')});

    var investor_1_balance = await realLandToken.balanceOf(investor_1);
    assert.equal(investor_1_balance.toNumber(), 1000000 * TOKENSDEC, "Investor 1 should have week1 cap");

    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(1, 'ether')});
    });

  });

  it("2. end sale and check owner allocations", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleEndTime);

    //Check non-owner can't call
    await assertFail(async () => {
      await realLandCrowdSale.allocateTokens({from: investor_1});
    });

    await realLandCrowdSale.allocateTokens({from: OWNER});

    var team_balance = await realLandToken.balanceOf(TEAM);
    var marketting_balance = await realLandToken.balanceOf(MARKETTING);
    var ipo_platform_balance = await realLandToken.balanceOf(IPO_PLATFORM);

    var expected_team_balance = 2653846153846158;//6900000000000000 - (expected_marketting_balance + expected_ipo_platform_balance);
    var expected_marketting_balance = 1326923076923074;//6900000000000000 * (3.5/18.2);
    var expected_ipo_platform_balance = 2919230769230768;//6900000000000000 * (7.7/18.2);

    assert.equal(team_balance.toNumber(), expected_team_balance,"Team balance set correctly");
    assert.equal(marketting_balance.toNumber(), expected_marketting_balance,"Marketting balance set correctly");
    assert.equal(ipo_platform_balance.toNumber(), expected_ipo_platform_balance,"IPO platform balance set correctly");
    assert.equal((await realLandToken.totalSupply()).toNumber(), 70000000 * TOKENSDEC, "Total Supply should be 70000000");

  });

  it("3. check token allocations can only be run once", async () => {
    //Check non-owner can't call
    await assertFail(async () => {
      await realLandCrowdSale.allocateTokens({from: OWNER});
    });
  });

});
