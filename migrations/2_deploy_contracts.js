var MiniMeTokenFactory = artifacts.require("./MiniMeTokenFactory.sol");
var ProfitSharing = artifacts.require("./ProfitSharing.sol");
var RealLandToken = artifacts.require("./RealLandToken.sol");

var OWNER = web3.eth.accounts[0];

//NB - change from mocked contracts to non-mocked version
var RealLandCrowdSale = artifacts.require("./RealLandCrowdSaleMock.sol");

//Owner of below contracts will be truffle deployment address
module.exports = async function(deployer) {
  deployer.deploy(MiniMeTokenFactory).then(function() {
    return deployer.deploy(RealLandToken, MiniMeTokenFactory.address, {from: OWNER});
  }).then(function () {
    return deployer.deploy(RealLandCrowdSale, RealLandToken.address, {from: OWNER});
  }).then(function () {
    return RealLandToken.deployed();
  }).then(function (token) {
    return token.changeController(RealLandCrowdSale.address, {from: OWNER});
  }).then(function () {
    return deployer.deploy(ProfitSharing, RealLandToken.address, {from: OWNER});
  });
};
