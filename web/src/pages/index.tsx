import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import React from "react";

import Navbar from "../components/Navbar";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
  const meQuery = useMeQuery();
  

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {meQuery.data?.me ? (
        <Flex
          alignItems={"center"}
          justifyContent="center"
          mt="10"
          flexDir={"column"}
        >
          <Heading fontSize={"3xl"}>
            {" "}
            There is nothing new going on right now...
          </Heading>
          <Text fontSize={"lg"} mt="10">
            {" "}
            Come back later 😭
          </Text>
        </Flex>
      ) : (
        <Flex
          alignItems={"center"}
          justifyContent="center"
          mt="10"
          flexDir={"column"}
        >
          <Heading fontSize={"3xl"}> Welcome to Manabi</Heading>
          <Text fontSize={"lg"} mt="10">
            {" "}
            Create your account to get started! 😎
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Index;
