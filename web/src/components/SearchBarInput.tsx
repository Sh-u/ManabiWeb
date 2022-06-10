import { Search2Icon, CalendarIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Input,
  InputRightElement,
  Kbd,
  Text,
  Flex,
  Link,
  List,
  ListItem,
  ListIcon,
  Avatar,
  Icon,
  Divider,
  InputLeftAddon,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { SearchResults } from "../types";
import {
  SearchForDeckQuery,
  SearchForDeckDocument,
} from "../generated/graphql";
import { client } from "../pages/client";

interface SearchBarProps {
  showSearchBody: boolean;
  searchResults: SearchResults[];
  onChange: (event: any) => Promise<void>;
  onFocus: () => void;
  searchRef: React.MutableRefObject<any>;
}

const SearchBarInput = () => {
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

  useEffect(() => {
    if (!showSearchBody) {
      setShowSearchBody(true);
    }
  }, [searchValue]);
  const onFocus = useCallback(() => {
    console.log("focus");

    console.log(showSearchBody);
    window.addEventListener("click", onClick);
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchBody(false);
      window.removeEventListener("click", onClick);
    }
  }, []);
  return (
    <>
      <InputGroup  rounded="2xl">
        
        <InputLeftElement children={<Search2Icon color={useColorModeValue("gray.600", "gray.200")}/>}/>
        
        <Input
          onChange={onChange}
          onFocus={onFocus}
          ref={searchRef}
          type={"text"}
          placeholder="Search for deck"
          h="60px"
         
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
  
      {showSearchBody ? (
        <Box
          position={"absolute"}
          width="full"
          bg="gray.600"
          top="20"
          h="xs"
          rounded="lg"
          zIndex={"10"}
        >
          <List spacing={3} w="full" p="2">
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
                    textDecor={"none"}
                    bg="gray.700"
                    _hover={{
                      bg: "gray.400",
                      cursor: "pointer",
                    }}
                    w="full"
                    rounded={"xl"}
                    position="relative"
                  >
                    <Flex align="center" justify="start" p="2">
                      <ListIcon as={CalendarIcon} color="gray.500" />

                      <Flex align="center" justify="center" flexDir={"column"}>
                        <Flex align="center" justify="center">
                          <Avatar
                            name="author"
                            src="https://i.imgur.com/1M2viYL.png"
                            ml="2"
                            w="5"
                            h="5"
                          />
                          <Text fontSize={"xs"} ml="2" color="gray.500">
                            by: {result.user.username ?? result.user._id}
                          </Text>
                        </Flex>
                        <Text ml="2">{result.title}</Text>
                      </Flex>
                    </Flex>
                    <Box
                      position="absolute"
                      top="4"
                      right="5"
                      padding={"inherit"}
                      color="gray.500"
                    >
                      <Icon as={ExternalLinkIcon} h="5" w="5" />
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
