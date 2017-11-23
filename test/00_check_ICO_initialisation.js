//testrpc --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e1c, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e11, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e12, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e13, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e14, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e15, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e16, 100000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e17, 100000000000000000000000000"

const RealLandToken = artifacts.require("./RealLandToken.sol");
const RealLandCrowdSale = artifacts.require("./RealLandCrowdSaleMock.sol");

const assertFail = require("./helpers/assertFail");

contract('Check ICO Initialisation', function (accounts) {

  var saleStartTime = 1512129600;
  var saleEndTime = 1517400000;

  var OWNER = accounts[0];
  var TEAM = "0x1";
  var MARKETTING = "0x2";
  var IPO_PLATFORM = "0x3";
  var investor_1 = accounts[1];
  var investor_2 = accounts[2];
  var investor_3 = accounts[3];

  // =========================================================================
  it("0. check initial settings", async () => {

    var realLandToken = await RealLandToken.deployed();
    var realLandCrowdSale = await RealLandCrowdSale.deployed();

    //Check owner address
    assert.equal(await realLandCrowdSale.owner(), OWNER, "Crowdsale owner set");

    //Check token address
    assert.equal(await realLandCrowdSale.tokenContract(), RealLandToken.address, "Token contract set");

    //Balances should be zero
    assert.equal(await realLandToken.totalSupply(), 0, "Token should have 0 supply");

  });

});
