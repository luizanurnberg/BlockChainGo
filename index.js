const express = require("express");
const VotingSystem = require("./VotingSystem.json");
const { Web3 } = require("web3");
const rcpEndpoint = "http://127.0.0.1:7545";
const contractAddress = "0x37a1F71063ce5529fEf5df11eA63786bdDA466e4";
const contractABI = VotingSystem.abi;
const app = express();
app.use(express.json);

const web3 = new Web3(new Web3.providers.HttpProvider(rcpEndpoint));
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post("/registerVoter", async (req, res) => {
  try {
    const { accountAddress } = req.body;
    const result = await contract.methods.register();
    res.json({ message: "Eleitor registrado com sucesso", receipt });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao registrar eleitor", message: error.message });
  }
});

app.listen(8000, () => {
  console.log("API rodando na porta 8000");
});
