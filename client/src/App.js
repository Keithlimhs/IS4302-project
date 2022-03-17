import React, { Component, useState, useEffect } from "react";

import Header from "./components/Header";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MetaContext } from "./contexts/MetaContext";

import "./App.css";
import { Container, Center, Heading, Box } from "@chakra-ui/react";
import EmployeeView from "./components/EmployeeView";
import EmployerView from "./components/EmployerView";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { loadWeb3 } from "./services.js";

export default function App() {
  const [web3, setWeb3] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    if (web3 == null) {
      loadWeb3({setWeb3, setUserAddress});
    }
  }, []);

  return (
    <>
      <MetaContext.Provider value={{ userAddress }}>
        <Box>
          <BrowserRouter>
            <Header userAddress={userAddress} setUserAddress={setUserAddress} setWeb3={setWeb3} />
            <Center bg="brand.700">
              <Heading color="white" m={10}>
                ClearLeth
              </Heading>
            </Center>
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/employee" element={<EmployeeView />}></Route>
              <Route path="/employer" element={<EmployerView />}></Route>
            </Routes>
            <Footer />
          </BrowserRouter>
        </Box>
      </MetaContext.Provider>
    </>
  );
}
