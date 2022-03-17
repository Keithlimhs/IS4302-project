import ClearLethContract from "./contracts/ClearLeth.json";
import getWeb3 from "./getWeb3";
import { ethers } from "ethers";

export const loadWeb3 = async ({ setWeb3, setUserAddress }) => {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

/*     const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress(); */
    

    setWeb3(web3);
    setUserAddress(accounts);
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.error(error);
  }
};

export const getContract = async ({ web3 }) => {
  // Get the contract instance.
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ClearLethContract.networks[networkId];
  const instance = new web3.eth.Contract(
    ClearLethContract.abi,
    deployedNetwork && deployedNetwork.address
  );
  return instance;
};

export const callContractExample = async () => {
  /*     const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

     Update state with the result.
    this.setState({ storageValue: response }); */
};
