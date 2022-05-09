import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Link,
  useColorMode,
  useMediaQuery,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Fade,
  useDisclosure,
  MenuGroup,
  MenuDivider,
  InputGroup,
  Stack,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

import "font-awesome/css/font-awesome.min.css";

import NextLink from "next/link";
import {
  SearchIcon,
  ChevronDownIcon,
  SettingsIcon,
  CloseIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";

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
          <h1>ManabiWeb</h1>
        </Box>

        <Button
          fontSize={"24px"}
          variant={"solid"}
          ml={{ base: "20px", md: "50px" }}
          color="white"
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          rounded={"lg"}
          _hover={{
            transform: "scale(1.05)",
          }}
        >
          Learn
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
        </InputGroup>
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
          <Box>
            <Flex justifyContent="flex-end">
              <Menu>
                <MenuButton
                  _hover={{
                    opacity: "0.8",
                  }}
                >
                  <Image
                    src="https://i.imgur.com/1M2viYL.png"
                    w={"40px"}
                    h={"40px"}
                    alt=""
                    rounded={"full"}
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
                  <MenuItem>
                    {" "}
                    <Button
                      variant={"unstyled"}
                      isLoading={loading}
                      onClick={async () => {
                        await logout();
                      }}
                    >
                      Logout
                    </Button>
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
