const express = require("express");
const cors = require("cors");
const VotingSystem = require("../VotingSystem.Ethereum/build/contracts/VotingSystem.json");
const { Web3 } = require("web3");
const { toBigInt } = require("web3-utils");
const rcpEndpoint = "http://127.0.0.1:7545";
const contractAddress = "0xFf76C12062791E21CbA79A8036278e82B5829991"; //COLOCAR O ADDRESS QUE APARECER APÓS RODAR O MIGRATE
const contractABI = VotingSystem.abi;
const app = express();
app.use(express.json());
app.use(cors());

const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint));
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post("/vote", async (req, res) => {
  try {
    const { accountAddress, candidateId } = req.body;
    if (!accountAddress || !candidateId) {
      return res.status(400).json({
        error: "É necessário que todos os campos estejam preenchidos.",
      });
    }

    const senderDetails = await contract.methods.voters(accountAddress).call();

    if (senderDetails.weight == 0) {
      return res.status(403).json({
        error: "Você não tem direito de voto.",
      });
    }

    if (senderDetails.voted) {
      return res.status(403).json({
        error: "Você já votou.",
      });
    }

    const result = await contract.methods
      .vote(toBigInt(candidateId))
      .send({ from: accountAddress, gas: 2000000 });

    const receipt = await web3.eth.getTransactionReceipt(
      result.transactionHash
    );

    if (receipt.status) {
      const serializedReceipt = serializeReceipt(result);
      res.json({ message: "Voto computado com sucesso", serializedReceipt });
    } else {
      res.status(500).json({
        error: "Erro ao computar voto",
        message: "A transação falhou",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Erro ao computar voto",
      message: error.message,
    });
  }
});

app.post("/giveVotePermission", async (req, res) => {
  try {
    const { chainPersonAccountAdress, voterAddress } = req.body;
    if (!chainPersonAccountAdress || !voterAddress) {
      return res.status(400).json({
        error: "É necessário que todos os campos estejam preenchidos.",
      });
    }

    const sender = await web3.eth.getAccounts();
    const chairperson = await contract.methods.chairperson().call();

    if (chainPersonAccountAdress !== chairperson) {
      res
        .status(403)
        .json({ error: "Apenas o presidente pode dar direito de voto." });
      return;
    }

    const voter = await contract.methods.voters(voterAddress).call();

    if (voter.hasVoted || voter.isRegistered || voter.weight != 0) {
      res
        .status(400)
        .json({ error: "O eleitor já votou ou já possui direito de voto." });
      return;
    }

    const result = await contract.methods
      .giveRightToVote(voterAddress)
      .send({ from: sender[0], gas: 2000000 });

    const receipt = await web3.eth.getTransactionReceipt(
      result.transactionHash
    );

    if (receipt.status) {
      const serializedReceipt = serializeReceipt(result);
      res.json({
        message: "Direito de voto concedido com sucesso",
        serializedReceipt,
      });
    } else {
      res.status(500).json({
        error: "Erro ao conceder direito de voto",
        message: "Transação falhou",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Erro ao conceder direito de voto",
      message: error.message,
    });
  }
});

app.get("/winnerName", async (req, res) => {
  try {
    const winnerName = await contract.methods.winnerName().call();
    res.json({ winnerName });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao obter o nome do vencedor",
      message: error.message,
    });
  }
});

function serializeReceipt(receipt) {
  return {
    ...receipt,
    blockNumber: receipt.blockNumber.toString(),
    cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
    effectiveGasPrice: receipt.effectiveGasPrice.toString(),
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status.toString(),
    transactionIndex: receipt.transactionIndex.toString(),
    type: receipt.type.toString(),
  };
}

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
