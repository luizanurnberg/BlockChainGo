const Migrations = artifacts.require("VotingSystem");

module.exports = function (deployer) {
  deployer.deploy(Migrations, ["Proposta 1", "Proposta 2", "Proposta 3"]);
};
