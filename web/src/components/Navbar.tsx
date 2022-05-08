import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link,
  useColorMode,
  useMediaQuery,
  Image
} from "@chakra-ui/react";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

import 'font-awesome/css/font-awesome.min.css';

import NextLink from "next/link";
import { SearchIcon } from "@chakra-ui/icons";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";

const Navbar = () => {
  const MeQuery = useMeQuery();
  const { colorMode, toggleColorMode } = useColorMode();
  const [logout, { loading }] = useLogoutMutation({
    update(cache, { data }) {
      cache.writeQuery({
        query: MeDocument,
        data: {
          me: null,
        },
      });
    },
  });

  return (
    <Flex
      maxW="7xl"
      mx={"auto"}
      h={"50px"}
      alignItems={"center"}
      justifyContent={"space-between"}
      p={"5px"}
    >
      <Flex alignItems={"center"}>
        <Box
          fontSize={"24px"}
          fontWeight={"600"}
          display={{ base: "none", md: "block" }}
        >
          <h1>ManabiWeb</h1>
        </Box>

        <Button
          fontSize={"24px"}
          variant={"solid"}
          ml={{ base: "20px", md: "50px" }}
          rounded={"lg"}
          _hover={{
            transform: "scale(1.05)",
            color: "white",
          }}
        >
          Learn
        </Button>
      </Flex>

      <Box w="lg" display={{ base: "none", md: "block" }}>
        <Input type={'text'} placeholder='&#xF002; Search... ' rounded="lg" fontFamily='FontAwesome'/>
      </Box>

      <SearchIcon display={{ base: "block", md: "none" }} />

      <Flex justifyContent={"flex-end"} alignItems="center">
        <Link href="https://discord.gg/e4zbyzPbcD">
          <IconButton
            variant="ghost"
            size="md"
            fontSize="lg"
            marginRight="5px"
            aria-label=""
          >
            <FaDiscord />
          </IconButton>
        </Link>
        <Link href="https://github.com/Sh-u/ManabiWeb">
          <IconButton
            variant="ghost"
            size="md"
            fontSize="lg"
            marginRight="5px"
            aria-label=""
          >
            <FaGithub />
          </IconButton>
        </Link>
        <ColorModeSwitcher />

        {MeQuery.data?.me?.username ? (
          <Box fontSize={"24px"}>
            <Flex justifyContent="flex-end">
              <Flex  alignItems={'center'} bg='black' rounded={'full'} cursor='pointer' p='1'  _hover={{
            
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
                <Box ml={"10px"} fontWeight='bold'>{MeQuery.data?.me?.username}</Box>
                <Image ml={"10px"} src="https://i.imgur.com/1M2viYL.png" w={'40px'} h={'40px'} alt="" rounded={'full'}></Image>
                <Button ml={"10px"}
                variant={"unstyled"}
                isLoading={loading}
                onClick={async () => {
                  await logout();
                }}
              >
                Logout
              </Button>
              </Flex>
              

              
            </Flex>
          </Box>
        ) : (
          <Button rounded="lg" fontSize={"24px"} variant={"ghost"}>
            <Flex justifyContent={"flex-end"}>
              <NextLink href="/login">
                <Link>Login</Link>
              </NextLink>
            </Flex>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
