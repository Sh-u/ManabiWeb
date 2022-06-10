import {
  Search2Icon,
  SearchIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Link,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Text,
  Icon,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { getEventListeners } from "node:events";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {
  Deck,
  GetMyDecksDocument,
  GetMyDecksQuery,
  MeDocument,
  SearchForDeckDocument,
  SearchForDeckQuery,
  useLogoutMutation,
  useMeQuery,
  useSearchForDeckQuery,
} from "../generated/graphql";
import { client } from "../pages/client";
import { SearchResults } from "../types";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

import SearchBarButton from "./SearchBarButton";
import SearchBarInput from "./SearchBarInput";



const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const MeQuery = useMeQuery();

  const [showSearchBody, setShowSearchBody] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const searchRef = useRef(null);

  const onChange = useCallback(async (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.length) {
      const { data, loading, error } = await client.query<SearchForDeckQuery>({
        query: SearchForDeckDocument,
        variables: {
          input: value,
        },
      });
      if (data?.searchForDeck) {
        setSearchResults(data?.searchForDeck);
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  const onFocus = useCallback(() => {
    if (showSearchBody) return;

    setShowSearchBody(true);

    window.addEventListener("click", onClick);
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchBody(false);
      window.removeEventListener("click", onClick);
    }
  }, []);

  const { colorMode, toggleColorMode } = useColorMode();
  const [logout, { loading }] = useLogoutMutation({
    update(cache, { data }) {
      cache.writeQuery({
        query: MeDocument,
        data: {
          me: null,
        },
      });

      cache.writeQuery({
        query: GetMyDecksDocument,
        data: {
          getMyDecks: {
            decks: [],
            errors: "user not found",
          },
        },
      });
    },
  });

  return (
    <Flex
      maxW="7xl"
      mx={"auto"}
      h={"72px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Flex alignItems={"center"}>
        <Box
          fontSize={"24px"}
          fontWeight={"600"}
          display={{ base: "none", md: "block" }}
          color={useColorModeValue("gray.800", "gray.200")}
        >
          <NextLink href="/">
            <Link fontSize={"xl"} style={{ textDecoration: "none" }}>
              {" "}
              ManabiWeb
            </Link>
          </NextLink>
        </Box>

        <Button
          fontSize={"24px"}
          variant={"solid"}
          ml={{ base: "20px", md: "50px" }}
          color="white"
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          rounded={"lg"}
          _hover={{
            transitionDuration: "100ms",
            transform: "scale(1.1 )",
          }}
        >
          <NextLink href="/learn">
            <Link style={{ textDecoration: "none" }}> Learn</Link>
          </NextLink>
        </Button>
      </Flex>

      <Box w="lg" display={{ base: "none", md: "block" }} position="relative">
        <SearchBarButton/>
       
      </Box>

      <SearchIcon display={{ base: "block", md: "none" }} />

      <Flex justifyContent={"flex-end"} alignItems="center">
        <Link href="https://discord.gg/e4zbyzPbcD" isExternal>
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
        <Link href="https://github.com/Sh-u/ManabiWeb" isExternal>
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
          <Box>
            <Flex justifyContent="flex-end">
              <Menu>
                <MenuButton
                  _hover={{
                    opacity: "0.8",
                  }}
                >
                  <Avatar
                    src="https://i.imgur.com/1M2viYL.png"
                    w={"40px"}
                    h={"40px"}
                    name="User"
                  />
                </MenuButton>

                <MenuList>
                  <MenuGroup title="Profile">
                    <MenuItem fontWeight={"bold"}>
                      {MeQuery.data?.me?.username}
                    </MenuItem>
                    <MenuItem>Settings </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem
                    onClick={async () => {
                      console.log("logging out");
                      await logout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
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
