import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

import NextLink from 'next/link'

const Navbar = () => {
  const MeQuery = useMeQuery();
  const [logout, { loading }] = useLogoutMutation({update(cache, {data}) {
    
    cache.writeQuery({
      query: MeDocument,  
      data: {
        me: null
      }
    })
  }});

  
  return (
    <Flex
      h={"60px"}
      background="gray.200"
      alignItems={"center"}
      justifyContent={"space-between"}
      p={"10px"}
    >
      <Box fontSize={"24px"} fontWeight={"600"} w="full">
        <h1>SHUDDIT</h1>
      </Box>

      <Box w="full">
        <Input
          placeholder="Search"
          borderRadius={"2xl"}
          borderColor={"gray.300"}
        />
      </Box>
      {MeQuery.data?.me?.username ? (
        <Box w="full" fontSize={"24px"}>
          <Flex justifyContent="flex-end">
            <Box mr={"20px"}>{MeQuery.data?.me?.username}</Box>

            <Button
              variant={"solid "}
              isLoading={loading}
              onClick={async () => {
                await logout();
              }}
            >
              Logout
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box w="full" fontSize={"24px"}>
          <Flex justifyContent={"flex-end"}>
            <NextLink href="/login">
            <Link >Login</Link>
            </NextLink>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
