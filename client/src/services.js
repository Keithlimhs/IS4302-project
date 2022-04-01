import ClearLethContract from "./contracts/ClearLeth.json";
import getWeb3 from "./getWeb3";
import { ethers } from "ethers";

export const loadWeb3 = async (setUserAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    setUserAddress(walletAddress);
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.error(error);
  }
};

export const getContract = async () => {
  // Get the contract instance.
  let provider = new ethers.providers.Web3Provider(window.ethereum);

  // GET CONTRACT ADDRESS
  let deployedNetwork = ClearLethContract.networks[5777];
  let contractAddress = deployedNetwork.address;

  let abi = ClearLethContract.abi;
  let signer = provider.getSigner();
  let contractInstance = new ethers.Contract(contractAddress, abi, signer);
  console.log(contractInstance);
  return contractInstance;
};

export const getAllEmployees = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllEmployees();
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllEmployers = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllEmployers();
  } catch (error) {
    console.error(error);
  }
};

export const getAllAuthorities = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllAuthorities();
  } catch (error) {
    console.error(error);
  }
};

export const getEmployeeLeaveBalance = async (address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.employeeLeaveBalance(address);
  } catch (error) {
    console.error(error);
  }
};

export const addEmployee = async (address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployee(address);
  } catch (error) {
    console.error(error);
  }
};

export const addEmployer = async (address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployer(address);
  } catch (error) {
    console.error(error);
  }
};
