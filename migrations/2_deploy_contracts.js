var ClearLeth = artifacts.require("./ClearLeth.sol");

module.exports = function(deployer) {
  let initialLeaveAmount = 12
  deployer.deploy(ClearLeth, initialLeaveAmount);
};
