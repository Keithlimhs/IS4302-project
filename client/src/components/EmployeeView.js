import React, { useEffect, useState } from "react";
import { MetaContext } from "../contexts/MetaContext";
import {
  Box,
  Text,
  Flex,
  Heading,
  Center,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import MyInfo from "./MyInfo";
import { getMyInfo, getOwnerAddress } from "../services";

export default function EmployeeView() {
  const { userAddress } = React.useContext(MetaContext);
  const [myInfo, setMyInfo] = useState(null);
  const [accessRight, setAccessRight] = useState(false);

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    let infoResult = await getMyInfo();
    if (infoResult == null) {
      return;
    }
    let ownerAddress = await getOwnerAddress();
    if (infoResult.role == "Employee" || infoResult.wallet == ownerAddress) {
      console.log("Accessed!");
      setAccessRight(true);
    }
    setMyInfo(infoResult);
  };
  

  return (
    <>
      <Center bg="brand.gold">
        <Heading color="white" m={6}>
          Employee
        </Heading>
      </Center>
      <Flex
        borderWidth="1px"
        borderRadius="lg"
        m={5}
        px={10}
        overflow="hidden"
        flexDirection="column"
        boxShadow="md"
      >
        <MyInfo myInfo={myInfo} />
      </Flex>
      {accessRight && (
        <Box>
          <Flex
            borderWidth="1px"
            borderRadius="lg"
            m={5}
            px={10}
            overflow="hidden"
            flexDirection="column"
            boxShadow="md"
          >
            <Box p={3}>
              <Heading size="lg" py="5">
                Leave Management
              </Heading>
              <Tabs>
                <TabList>
                  <Tab>Apply Leaves</Tab>
                  <Tab>View Leaves</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <p>two!</p>
                  </TabPanel>
                  <TabPanel>
                    <p>three!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
          <br />
        </Box>
      )}

      {!accessRight && (
        <Center>
          <Heading>Sorry, you do not have access!</Heading>
        </Center>
      )}
      <br />
      <br />
    </>
  );
}
