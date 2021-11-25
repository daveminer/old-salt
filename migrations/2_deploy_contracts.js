var Adoption = artifacts.require("Adoption");
var Salty = artifacts.require("Salty");

module.exports = function (deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Salty);
};
