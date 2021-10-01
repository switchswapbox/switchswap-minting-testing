import Web3 from "web3";
import { useState } from "react";
import { ABI } from "./abi";
import detectEthereumProvider from "@metamask/detect-provider";
import "./App.css";

function App() {
  const [acc, setAcc] = useState("");

  const connectMetamaskWallet = async () => {
    const provider = await detectEthereumProvider();
    window.web3 = new Web3(window.ethereum);
    if (provider && provider.isMetaMask) {
      const chainId = await provider.request({
        method: "eth_chainId",
      });

      if (parseInt(chainId, 16) === 137) {
        const status = await provider.request({
          method: "eth_requestAccounts",
        });
        setAcc(status[0]);
      }
    }
  };

  async function load() {
    await connectMetamaskWallet();
    window.contract = await loadContract();
  }

  async function loadContract() {
    return await new window.web3.eth.Contract(
      ABI,
      "0xa0Afb3513B99E1b099CE9F3C007eE937B04e7870"
    );
  }

  async function mintDataNTF() {
    await window.contract.methods
      .mintDataNTF(
        "0x56E032807165acF7e960A417B8473C865C048949",
        "https://gateway.pinata.cloud/ipfs/QmNxpDMiKJKUnVcQgxpWWz4jXiJpLAhdobBnpNGpftmxtk",
        "ipfs://QmTnE4JFony1X2LWKuuGyNQkrKDTBSiZZowquiRqCskXig",
        "crust://0xfdc3500246a8a95f8b51626f7d4627db74c327830affff7864f294917648e380"
      )
      .send({ from: acc });
    console.log("success");
  }

  return (
    <div className="App">
      <button type="button" onClick={load}>
        Enable wallet
      </button>
      <button type="button" onClick={mintDataNTF}>
        Mint
      </button>
    </div>
  );
}

export default App;
