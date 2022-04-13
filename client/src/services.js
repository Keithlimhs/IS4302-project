import ClearLethContract from "./contracts/ClearLeth.json";
import getWeb3 from "./getWeb3";
import { ethers } from "ethers";

// LOAD WEB3, SET USER ON INIT
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

// GET CONTRACT INSTANCE
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

/* ------------------- OPERATIONS -------------------*/

export const getOwnerAddress = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.contractOwner();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getMyInfo = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getUser();
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getNameOfAddress = async (address) => {
  try {
    let contractInstance = await getContract();
    const name = await contractInstance.getUserNameOf(address);
    return name;
  } catch (error) {
    console.error(error);
  }
};

/* ------------------- ROLES MANAGEMENT -------------------*/

// GET ALL EMPLOYEES
export const getAllEmployees = async () => {
  try {
    let result = [];
    let contractInstance = await getContract();
    const employees = await contractInstance.getAllEmployees();
    for (let i = 0; i < employees.length; i++) {
      let wallet = employees[i];
      let name = await contractInstance.getUserNameOf(wallet);
      result.push({ name, wallet });
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

// GET ALL EMPLOYERS
export const getAllEmployers = async () => {
  try {
    let result = [];
    let contractInstance = await getContract();
    let employers = await contractInstance.getAllEmployers();
    for (let i = 0; i < employers.length; i++) {
      let wallet = employers[i];
      let name = await contractInstance.getUserNameOf(wallet);
      result.push({ name, wallet });
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

// GET ALL AUTHORITIES
export const getAllAuthorities = async () => {
  try {
    let result = [];
    let contractInstance = await getContract();
    const authorities = await contractInstance.getAllAuthorities();
    for (let i = 0; i < authorities.length; i++) {
      let wallet = authorities[i];
      let name = await contractInstance.getUserNameOf(wallet);
      result.push({ name, wallet });
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

// ADD A EMPLOYEE
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

// ADD A EMPLOYER
export const addEmployer = async (company, name, address, leaveLimit) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addEmployer(company, name, address, leaveLimit);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// ADD A AUTHORITY
export const addAuthority = async (name, address) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.addAuthority(name, address);
    return response;
  } catch (error) {
    console.error(error);
  }
};

/* ------------------- LEAVES MANAGEMENT -------------------*/

// TAKES IN ARRAY OF DATES AND REASONS
export const applyLeaves = async (dates, reasons) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.applyLeaves(dates, reasons);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// INPUT LEAVE OBJECT EMIT EVENT
export const approveLeave = async (leaveId, address) => {
  try {
    let contractInstance = await getContract();
    let leave = await contractInstance.getLeaveInformation(leaveId);
    console.log(leave);
    const response = await contractInstance.approveLeave(leave);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// INPUT LEAVE OBJECT EMIT EVENT
export const rejectLeave = async (leaveId) => {
  try {
    let contractInstance = await getContract();
    let leave = await contractInstance.getLeaveInformation(leaveId);
    const response = await contractInstance.rejectLeave(leave);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// RETURN LEAVE INFO
export const getLeaveInformation = async (leaveId) => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getLeaveInformation(leaveId);
    return response;
  } catch (error) {
    console.error(error);
  }
};

// RETURN ARR OF EMPLOYEE'S LEAVE OBJECTS
export const getLeaveApplications = async (address) => {
  try {
    let result = [];
    let contractInstance = await getContract();
    const leaves = await contractInstance.getLeaveApplications(address);

    for (let i = 0; i < leaves.length; i++) {
      let id = leaves[i].id;
      let status = leaves[i].status;
      let date = leaves[i].date;
      let reason = leaves[i].reason;
      let employee = leaves[i].employee;
      let name = await contractInstance.getUserNameOf(employee);
      result.push({ id, status, date, reason, employee, name });
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

// RETURN EMPLOYEE'S LEAVE BALANCE
export const getLeaveBalance = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.getLeaveBalance();
    return response;
  } catch (error) {
    console.error(error);
  }
};

// RETURN ALL LEAVES UNDER A COMPANY
export const getCompanyLeaves = async (address) => {
  try {
    let contractInstance = await getContract();
    const employees = await contractInstance.getEmployeesByEmployer(address);
    let response = [];
    for (let i = 0; i < employees.length; i++) {
      let leaves = await getLeaveApplications(employees[i]);
      response = response.concat(leaves);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

// RETURN ALL LEAVES IN CONTRACT
export const getAllLeaves = async () => {
  try {
    let contractInstance = await getContract();
    const response = await contractInstance.allLeaves();
    return response;
  } catch (error) {
    console.error(error);
  }
};
