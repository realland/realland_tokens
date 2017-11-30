const BigNumber = require('bignumber.js');
const RealLandToken = artifacts.require("./RealLandToken.sol");
const RealLandCrowdSale = artifacts.require("./RealLandCrowdSaleMock.sol");

const assertFail = require("./helpers/assertFail");

contract('Check ICO Sale', function (accounts) {

  var saleStartTime = 1512475200;
  var saleEndTime = 1517832000;
  
  var OWNER = accounts[0];
  var TEAM = "0x1";
  var MARKETTING = "0x2";
  var IPO_PLATFORM = "0x3";
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

  //
  // if (elapsed < 1 weeks) return 25;
  // if (elapsed < 2 weeks) return 22;
  // if (elapsed < 3 weeks) return 20;
  // if (elapsed < 4 weeks) return 17;
  // if (elapsed < 5 weeks) return 15;
  // if (elapsed < 6 weeks) return 10;
  // if (elapsed < 7 weeks) return 7;
  // if (elapsed < 8 weeks) return 5;
  // if (elapsed < 9 weeks) return 2;
  //

  // if (elapsed < 1 weeks) return 1000000;
  // if (elapsed < 2 weeks) return 3000000;
  // if (elapsed < 3 weeks) return 5500000;
  // if (elapsed < 4 weeks) return 8500000;
  // if (elapsed < 5 weeks) return 12000000;
  // if (elapsed < 6 weeks) return 17000000;
  // if (elapsed < 7 weeks) return 24000000;
  // if (elapsed < 8 weeks) return 36000000;
  // if (elapsed < 9 weeks) return 56000000;

  // =========================================================================
  it("0. check can't contribute before sale starts", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(1, 'ether')});
    });

  });

  it("1. move to sale, check min. contribution", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleStartTime);

    //Check minimum contribution
    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(0.09, 'ether')});
    });

  });

  it("2. check week 1 bonus - 25%", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    var owner_start_balance = web3.eth.getBalance(OWNER);
    await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(1, 'ether')});

    var investor_1_balance = await realLandToken.balanceOf(investor_1);
    assert.equal(investor_1_balance.toNumber(), 1.25 * 10 * TOKENSDEC, "Investor 1 should have 25% bonus");
    var owner_end_balance = web3.eth.getBalance(OWNER);
    assert.equal(owner_end_balance.sub(owner_start_balance).toNumber(), 10**18, "OWNER receives funds");
  });

  it("3. check week 1 cap - 1000000", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(80000 - 1, 'ether')});

    var investor_1_balance = await realLandToken.balanceOf(investor_1);
    assert.equal(investor_1_balance.toNumber(), 1000000 * TOKENSDEC, "Investor 1 should have week1 cap");

    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_1, value: web3.toWei(1, 'ether')});
    });

  });

  it("4. check week 2 bonus - 22%", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleStartTime + WEEK);
    await realLandCrowdSale.sendTransaction({from: investor_2, value: web3.toWei(0.5, 'ether')});

    var investor_2_balance = await realLandToken.balanceOf(investor_2);
    assert.equal(investor_2_balance.toNumber(), 1.22 * 5 * TOKENSDEC, "Investor 2 should have 22% bonus");
  });

  it("5. check week 3 bonus - 20%", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleStartTime + 2 * WEEK);
    await realLandCrowdSale.sendTransaction({from: investor_3, value: web3.toWei(15, 'ether')});

    var investor_3_balance = await realLandToken.balanceOf(investor_3);
    assert.equal(investor_3_balance.toNumber(), 1.20 * 150 * TOKENSDEC, "Investor 3 should have 20% bonus");

  });

  it("6. check week 7 bonus and cap - 7% / 24000000", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleStartTime + 6 * WEEK);
    await realLandCrowdSale.sendTransaction({from: investor_4, value: web3.toWei(1, 'ether')});

    var investor_4_balance = await realLandToken.balanceOf(investor_4);
    assert.equal(investor_4_balance.toNumber(), new BigNumber(1.07).mul(10).mul(TOKENSDEC).toNumber(), "Investor 4 should have 7% bonus");

    var remainingAllocation = (new BigNumber(24000000)).mul(TOKENSDEC).sub(await realLandToken.totalSupply()).div(TOKENSDEC).div(1.07).div(10).mul(10**18);
    await realLandCrowdSale.sendTransaction({from: investor_4, value: remainingAllocation.toNumber()});

    assert.equal((await realLandToken.totalSupply()).toNumber(), 24000000 * TOKENSDEC, "Total balance correct");
    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_4, value: web3.toWei(1, 'ether')});
    });

  });

  it("7. check  can't transfer / approve tokens during the sale", async () => {
    var realLandToken = await RealLandToken.deployed();

    //check can't tranfer to address
    await assertFail(async () => {
      await realLandToken.transfer(investor_2, 1, {from: investor_4});
    });

    //check using approve and transfer also fails
    await assertFail(async () => {
      await realLandToken.approve(investor_1, 1, {from: investor_4});
    });

  });

  it("8. check can't contribute after sale", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    await realLandCrowdSale.setMockedNow(saleEndTime + 1);
    await assertFail(async () => {
      await realLandCrowdSale.sendTransaction({from: investor_4, value: web3.toWei(1, 'ether')});
    });

  });

  it("9. check can now transfer / approve", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    //check can transfer to utility
    await realLandToken.transfer(investor_6, 1, {from: investor_1});
    assert.equal((await realLandToken.balanceOf(investor_6)).toNumber(), 1, "transfer successful");

    //check using approve and transfer also works
    await realLandToken.approve(investor_6, 2, {from: investor_1});

    //check can transfer to utility
    await realLandToken.transferFrom(investor_1, investor_6, 2, {from: investor_6});
    assert.equal((await realLandToken.balanceOf(investor_6)).toNumber(), 3, "transfer successful");

  });


});
