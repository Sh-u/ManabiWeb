import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
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
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {
  GetMyDecksDocument,
  GetMyDecksQuery,
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
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

      cache.writeQuery({
        query: GetMyDecksDocument,
        data: {
          getMyDecks: {
            decks: undefined,
            errors: null,
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

      <Box w="lg" display={{ base: "none", md: "block" }}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              <Search2Icon color={useColorModeValue("gray.600", "gray.200")} />
            }
          />
          <Input
            type={"text"}
            placeholder="Search... "
            size="md"
            rounded="lg"
            backgroundColor={useColorModeValue("gray.100", "gray.700")}
            color={useColorModeValue("gray.400", "gray.200")}
            variant="filled"
            boxShadow={useColorModeValue("sm", "none")}
            focusBorderColor="pink.400"
            _placeholder={{
              opacity: 0.7,
              color: useColorModeValue("gray.900", "gray.200"),
            }}
            _focus={{ bg: useColorModeValue("gray.200", "gray.600") }}
            _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
          />
          <InputRightElement mr="3" children={<Kbd>Ctrl+K</Kbd>} />
        </InputGroup>
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
