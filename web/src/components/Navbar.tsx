import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

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
        <Input placeholder="Search" rounded="lg" />
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
