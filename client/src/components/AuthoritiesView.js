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
} from "@chakra-ui/react";
import ViewEmployees from "./ViewTabs/ViewEmployees";
import ViewEmployers from "./ViewTabs/ViewEmployers";
import ViewAuthorities from "./ViewTabs/ViewAuthorities";
import AddAuthorities from "./AuthoritiesTabs/AddAuthorities";

import MyInfo from "./MyInfo";
import { getMyInfo, getOwnerAddress, getAllEmployees, getAllEmployers, getAllAuthorities } from "../services";

export default function AuthoritiesView() {
  const { userAddress } = React.useContext(MetaContext);
  const [authorities, setAuthorities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [accessRight, setAccessRight] = useState(false);

  useEffect(() => {
    initView();
  }, []);


  const initEmployees = async () => {
    getAllEmployees().then((e) => {
      setEmployees(e);
    });
  };

  const initEmployers = async () => {
    getAllEmployers().then((e) => {
      setEmployers(e);
    });
  };

  const initAuthorities = async () => {
    getAllAuthorities().then((e) => {
      setAuthorities(e);
    });
  };

  const initView = async () => {
    console.log("init");

    let infoResult = await getMyInfo();
    if (infoResult == null) {
      return;
    }
    let ownerAddress = await getOwnerAddress();

    // 2 FOR AUTHORITIES
    if (infoResult.role == 2 || infoResult.wallet == ownerAddress) {
      console.log("Accessed!");
      setAccessRight(true);
    }
    setMyInfo(infoResult);
    initEmployees();
    initEmployers();
    initAuthorities();
  };

  return (
    <>
      <Center bg="brand.gold">
        <Heading color="white" m={6}>
          Authority
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
                  <Tab>Add Authorities</Tab>
                  <Tab>View Authorities</Tab>
                  <Tab>View Employers</Tab>
                  <Tab>View Employees</Tab>
                  <Tab>View Leaves</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <AddAuthorities setAuthorities={setAuthorities} 
                    authorities={authorities}/>
                  </TabPanel>
                  <TabPanel>
                    <ViewAuthorities
                      authorities={authorities}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ViewEmployers
                      employers={employers}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ViewEmployees
                      employees={employees}
                    />
                  </TabPanel>
                  <TabPanel>
                    <p>three!</p>
                  </TabPanel>
                  <TabPanel>
                    <p>four!</p>
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
