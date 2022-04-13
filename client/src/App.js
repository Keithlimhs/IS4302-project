import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MetaContext } from "./contexts/MetaContext";

import "./App.css";
import { Container, Center, Heading, Box } from "@chakra-ui/react";
import EmployeeView from "./components/EmployeeView";
import EmployerView from "./components/EmployerView";
import AuthoritiesView from "./components/AuthoritiesView";
import HomePage from "./components/HomePage";
import Header from "./components/General/Header";
import Footer from "./components/General/Footer";
import { loadWeb3 } from "./services.js";

export default function App() {
  //const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    if (userAddress == null) {
      loadWeb3(setUserAddress);
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
      setUserAddress(accounts[0]);
      window.location.reload();
    });
    
    // detect Network account change
    window.ethereum.on("networkChanged", function (networkId) {
      window.location.reload();
    });
  }, []);

  return (
    <>
      <MetaContext.Provider value={{ userAddress }}>
        <Box>
          <BrowserRouter>
            <Header userAddress={userAddress} setUserAddress={setUserAddress} />
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/employee" element={<EmployeeView />}></Route>
              <Route path="/employer" element={<EmployerView />}></Route>
              <Route path="/authorities" element={<AuthoritiesView />}></Route>
            </Routes>
            <Footer />
          </BrowserRouter>
        </Box>
      </MetaContext.Provider>
    </>
  );
}
