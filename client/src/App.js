import React, { Component, useState, useEffect } from "react";
import ClearLethContract from "./contracts/ClearLeth.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { Container, Center, Heading, Button } from "@chakra-ui/react";
import EmployeeView from "./components/EmployeeView";
import EmployerView from "./components/EmployerView";
import Footer from "./components/Footer";

export default function App() {
  const [storageValue, setStorageValue] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3 == null) {
      loadWeb3();
    }
  }, []);

  const loadWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ClearLethContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ClearLethContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(web3);
      setContract(instance);
      setAccounts(accounts);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const callContractExample = async () => {
    /*     const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

     Update state with the result.
    this.setState({ storageValue: response }); */
  };

  return (
    <>
      {web3 == null ? (
        <div>Loading Web3, accounts, and contract...</div>
      ) : (
        <></>
      )}
      <BrowserRouter>
        <Header />

        <Center bg="brand.700">
          <Heading color="white" m={10}>
            ClearLeth
          </Heading>
        </Center>

        <Heading size="l">My address: {accounts}</Heading>

        <Routes>
          <Route path="/" element={<EmployeeView />}></Route>
          <Route path="/employee" element={<EmployeeView />}></Route>
          <Route path="/employer" element={<EmployerView />}></Route>
        </Routes>
      </BrowserRouter>

      <Footer />
    </>
  );
}
