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
  return contractInstance;
};


export const getMyInfo = async () => {
  try {
    let contractInstance = await getContract();
    const name = await contractInstance.getUserName();
    const company = await contractInstance.getUserCompany();
    const wallet = await contractInstance.getUserWallet();
    let role = await contractInstance.getUserRole();
    if (role == 0) {
      role = "Employee";
    } else if (role == 1) {
      role = "Employer";
    } else {
      role = "Authority";
    }
    let response = {name, company, wallet, role};
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllEmployees = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllEmployees();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllEmployers = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllEmployers();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getAllAuthorities = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getAllAuthorities();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getEmployeeLeaveBalance = async (address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.employeeLeaveBalance(address);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const addEmployee = async (name, address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployee(name, address);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addEmployer = async (company, name, address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployer(company, name, address);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const addAuthority = async (name, address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployer(name, address);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const applyLeaves = async (dates, reasons) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.applyLeaves(dates, reasons);
    return response;
  } catch (error) {
    console.error(error);
  }
};
