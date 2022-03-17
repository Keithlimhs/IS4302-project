import React, { useEffect } from "react";
import { Box, Button, Container, Flex, Wrap } from "@chakra-ui/react";
import { RiWallet3Line } from "react-icons/ri";
import { loadWeb3 } from "../services.js";
import { MetaContext } from "../contexts/MetaContext";

// this method buggy
async function connect(setUserAddress, setWeb3) {
  await loadWeb3({ setUserAddress, setWeb3 });
  console.log("connecting");
  return;
}

async function checkIfWalletIsConnected(setUserAddress) {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      const account = accounts[0];
      setUserAddress(account);
      return;
    }
  }
}

export default function ConnectWallet({ setUserAddress, setWeb3 }) {
  const { userAddress } = React.useContext(MetaContext);

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  return (
    <Box pos="fixed" top="5" right="5">
      {userAddress ? (
        <Box>
          <Address userAddress={userAddress} />
        </Box>
      ) : (
        <Connect setUserAddress={setUserAddress} setWeb3={setWeb3} />
      )}
    </Box>
  );
}

function Connect({ setUserAddress, setWeb3 }) {
  return (
    <Button
      leftIcon={<RiWallet3Line />}
      color="white"
      bgGradient="linear(to-l, brand.700, brand.900)"
      _hover={{ bgGradient: "linear(to-l, brand.700, brand.900)" }}
      boxShadow="lg"
      size="lg"
      onClick={() => window.location.reload()/*connect(setUserAddress, setWeb3)*/}
      _focus={false}
    >
      Refresh
    </Button>
  );
}

function Address({ userAddress }) {
  return (
    <Button
      color="white"
      bgGradient="linear(to-l, brand.700, brand.900)"
      boxShadow="lg"
      _hover={false}
      _focus={false}
      size="lg"
    >
      {userAddress.toString().substring(0, 5)}…
      {userAddress.toString().substring(userAddress.toString().length - 4)}
    </Button>
  );
}
