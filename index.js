const express = require("express");
const VotingSystem = require("./smartcontract/build/contracts/VotingSystem.json");
const { Web3 } = require("web3");
const { toBigInt } = require("web3-utils");
const rcpEndpoint = "http://127.0.0.1:8545";
const contractAddress = "0x37a1F71063ce5529fEf5df11eA63786bdDA466e4";
const contractABI = VotingSystem.abi;
const app = express();
app.use(express.json());

const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint));
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.get("/voter", async (req, res) => {
  try {
    const { accountAddress } = req.body;
    const result = await contract.methods.getVoter(accountAddress);
    res.json({ candidates: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar candidatos", message: error.message });
  }
});

app.post("/vote", async (req, res) => {
  try {
    const { accountAddress, candidateId } = req.body;
    const result = await contract.methods.vote(toBigInt(candidateId))
      .send({ from: accountAddress, gas: 2000000  })
      .on('transactionHash', function (hash) {
        // Transaction hash received, the transaction is pending
        console.log('Transaction Hash:', hash);
      })
      .on('receipt', function (receipt) {
        // Transaction receipt received, the transaction was successful
        console.log('Transaction Receipt:', receipt);
      })
      .on('error', function (error, receipt) {
        // An error occurred during the transaction
        console.error('Transaction Error:', error);
      });

    const receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

    if (receipt.status) {
      const serializedReceipt = serializeReceipt(result);
      res.json({ message: "Voto computado com sucesso", serializedReceipt });
    } else {
      res.status(500).json({ error: "Erro ao computar voto", message: "Transaction failed" });
    }
    // res.json({ message: "Voto computado com sucesso", result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao computar voto", message: error.message });
  }
})

app.post("/registerVoter", async (req, res) => {
  try {
    const { accountAddress } = req.body;
    const result = await contract.methods.register(accountAddress).send({ from: accountAddress, gas: 2000000 });
    const serializedReceipt = await serializeReceipt(result);
    if (serializedReceipt.status) {
      res.json({ message: "Eleitor registrado com sucesso", serializedReceipt });
    } else {
      res.status(500).json({ error: "Erro ao computar voto", message: "Transaction failed" });
    }
    // res.json({ message: "Eleitor registrado com sucesso", result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao registrar eleitor", message: error.message });
  }
});

app.listen(8000, () => {
  console.log("API rodando na porta 8000");
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
    type: receipt.type.toString()
  }
}
