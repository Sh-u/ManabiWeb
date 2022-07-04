import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Text,
  Center,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {
  GetMyDecksDocument,
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";
import useColors from "../hooks/useColors";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import SearchBarButton from "./SearchBarButton";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { data: meData, loading: meLoading } = useMeQuery();
  const { getColor } = useColors();

  const [logout] = useLogoutMutation({
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

  const image = meData?.me?.image;

  return (
    <Flex
      maxW="7xl"
      mx={"auto"}
      h={"72px"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Flex alignItems={"center"} justify='center'>
        <Box
          fontSize={"24px"}
          fontWeight={"600"}
          display={{ base: "none", md: "block" }}
          color={getColor("gray.800", "gray.200")}
        >
          <NextLink href="/">
            <Link fontSize={"xl"} style={{ textDecoration: "none" }}>
              ManabiWeb
            </Link>
          </NextLink>
        </Box>

       
          <NextLink href="/learn" >
            <Link style={{ textDecoration: "none" }} fontSize='3xl' fontWeight={'bold'} ml='10'> Learn</Link>
          </NextLink>
       
      </Flex>

      <Box w="lg" display={{ base: "none", md: "block" }} position="relative">
        <SearchBarButton />
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

        {meData?.me?.username ? (
          <Box>
            <Flex justifyContent="flex-end">
              <Menu>
                <MenuButton
                  _hover={{
                    opacity: "0.8",
                  }}
                >
                  <Avatar
                    src={image ? "/" + image : null}
                    name={meData?.me?.username}
                    bg="red.400"
                    w={"40px"}
                    h={"40px"}
                  />
                </MenuButton>

                <MenuList>
                  <MenuGroup title="Profile">
                    <MenuItem fontWeight={"bold"}>
                      <NextLink href={`/profile/${meData?.me?.username}`}>
                        <Link style={{ textDecoration: "none" }} w="full">
                          {meData?.me?.username}
                        </Link>
                      </NextLink>
                    </MenuItem>
                    <MenuItem>
                      <NextLink href="/settings/account">
                        <Link style={{ textDecoration: "none" }} w="full">
                          Settings
                        </Link>
                      </NextLink>
                    </MenuItem>
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
