import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useCallback, useState } from "react";
import { TiDocumentText } from "react-icons/ti";
import {
  SearchForDeckDocument,
  SearchForDeckQuery,
} from "../generated/graphql";
import useColors from "../hooks/useColors";
import { client } from "../pages/client";
import { SearchResults } from "../types";

const SearchBarInput = () => {
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const { getColor } = useColors();

  const onChange = useCallback(async (event) => {
    const value = event.target.value;
    if (value.length) {
      const { data, loading, error } = await client.query<SearchForDeckQuery>({
        query: SearchForDeckDocument,
        variables: {
          input: value,
        },
      });
      if (!loading && data?.searchForDeck.length > 0) {
        setSearchResults([...data?.searchForDeck]); //error shows when setting value here
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  return (
    <>
      <InputGroup rounded="3xl">
        <InputLeftElement
          left="2"
          h="full"
          fontSize={"xl"}
          children={<SearchIcon color="red.800" />}
        />

        <Input
          pl="12"
          pr="0"
          fontSize={"lg"}
          onChange={onChange}
          type={"text"}
          placeholder="Search for deck"
          h="60px"
          bg={getColor("gray.50", "gray.700")}
          variant="filled"
          boxShadow={getColor("sm", "none")}
          _placeholder={{
            opacity: 0.7,
            color: getColor("gray.900", "gray.200"),
          }}
          _focus={{ bg: getColor("gray.50", "gray.700") }}
          _hover={{ bg: getColor("gray.50", "gray.700") }}
        />
      </InputGroup>

      {searchResults.length > 0 ? (
        <Box
          p="2"
          position={"absolute"}
          width="full"
          bg={getColor("gray.50", "gray.700")}
          top="45px"
          min-h="xs"
          h="auto"
          rounded="md"
          zIndex={"10"}
        >
          <List spacing={3} w="full" p="2">
            <Divider
              opacity={1}
              borderColor={getColor("gray.300", "gray.500")}
              orientation="horizontal"
              mt="0"
            />
            {searchResults.map((result, index) => (
              <NextLink
                href={`/deck/${result.title}-${result._id}`}
                key={index}
              >
                <Link
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <ListItem
                    role="group"
                    p="1"
                    mt="3"
                    textDecor={"none"}
                    bg={getColor("gray.200", "gray.600")}
                    _hover={{
                      bg: getColor("red.700", "red.800"),
                      cursor: "pointer",
                    }}
                    w="full"
                    rounded={"xl"}
                    position="relative"
                  >
                    <Flex align="center" justify="start" p="2">
                      <ListIcon
                        fontSize={"2xl"}
                        as={TiDocumentText}
                        color={getColor("gray.400", "gray.400")}
                        _groupHover={{ color: "gray.300" }}
                      />

                      <Flex align="center" justify="center" flexDir={"column"}>
                        <Flex align="center" justify="center">
                          <Avatar
                            name="author"
                            src="https://i.imgur.com/1M2viYL.png"
                            ml="2"
                            w="5"
                            h="5"
                          />
                          <Text
                            fontSize={"xs"}
                            fontWeight="semibold"
                            ml="2"
                            color={getColor("gray.400", "gray.400")}
                            _groupHover={{ color: "gray.300" }}
                          >
                            by: {result.user.username ?? result.user._id}
                          </Text>
                        </Flex>
                        <Text
                          fontWeight={"semibold"}
                          fontSize="md"
                          ml="2"
                          _groupHover={{ color: "white" }}
                        >
                          {result.title}
                        </Text>
                      </Flex>
                    </Flex>
                    <Box
                      position="absolute"
                      top="4"
                      right="5"
                      padding={"inherit"}
                    >
                      <Icon
                        as={ExternalLinkIcon}
                        h="5"
                        w="5"
                        color={getColor("gray.400", "gray.400")}
                        _groupHover={{ color: "gray.300" }}
                      />
                    </Box>
                  </ListItem>
                </Link>
              </NextLink>
            ))}
          </List>
        </Box>
      ) : null}
    </>
  );
};

export default SearchBarInput;
