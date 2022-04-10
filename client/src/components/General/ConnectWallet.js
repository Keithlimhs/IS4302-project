import React, { useEffect } from "react";
import { Box, Button, Container, Flex, Wrap } from "@chakra-ui/react";
import { RiWallet3Line } from "react-icons/ri";
import { loadWeb3 } from "../../services.js";
import { MetaContext } from "../../contexts/MetaContext";

export default function ConnectWallet({setUserAddress}) {
  const { userAddress } = React.useContext(MetaContext);

  const handleConnect = async (setUserAddress) => {
    console.log("connecting...");
    await loadWeb3(setUserAddress);
    return;
  };

  const checkIfWalletIsConnected = async (setUserAddress) => {
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
  };

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  return (
    <Box pos="fixed" top="5" right="5">
      {userAddress ? (
        <Box>
          <Button
            color="white"
            bgGradient="linear(to-l, brand.yellow, brand.gold)"
            boxShadow="lg"
            _hover={false}
            _focus={false}
            size="lg"
          >
            {userAddress.toString().substring(0, 5)}…
            {userAddress
              .toString()
              .substring(userAddress.toString().length - 4)}
          </Button>
        </Box>
      ) : (
        <Button
          leftIcon={<RiWallet3Line />}
          color="white"
          bgGradient="linear(to-l, brand.700, brand.900)"
          _hover={{ bgGradient: "linear(to-l, brand.700, brand.900)" }}
          boxShadow="lg"
          size="lg"
          onClick={() => handleConnect(setUserAddress)}
          _focus={false}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}
