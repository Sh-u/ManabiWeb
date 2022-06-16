import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import router, { useRouter } from "next/router";
import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
  const {data: meData, loading} = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !meData?.me) {
      router.push("/");
    }
  }, [loading, meData?.me]);

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {meData?.me ? (
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
