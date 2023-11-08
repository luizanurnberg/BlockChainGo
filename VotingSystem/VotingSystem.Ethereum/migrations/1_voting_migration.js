const VotingSystem = artifacts.require("VotingSystem");

module.exports = function (deployer) {
  const proposalNames = [
    web3.utils.fromAscii("Proposal 1"),
    web3.utils.fromAscii("Proposal 2"),
  ];

  deployer.deploy(VotingSystem, proposalNames);
};
