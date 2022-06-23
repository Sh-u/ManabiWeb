import { Flex, Text, Button } from "@chakra-ui/react";
import React from "react";
import { Deck, DeckResponse, FindDeckQuery, Maybe } from "../generated/graphql";
import Post from "./Post";

interface DeckOverviewProps {
  data: FindDeckQuery;
  handleStudyNowButton: () => void;
}

const DeckOverview = ({ data, handleStudyNowButton }: DeckOverviewProps) => {
  return (
    <>

    
      <Flex
        flexDir={"column"}
        alignItems="center"
        justify={"center"}
        width={"50%"}
      >
        <Flex flexDir={"column"} alignItems="start" justify={"center"}>
          <Flex>
            New: <Text ml="5">{data?.findDeck?.decks[0]?.posts?.length}</Text>
          </Flex>
          <Flex>
            Learning: <Text ml="5">0</Text>
          </Flex>
          <Flex>
            To Review: <Text ml="5">0</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={"column"} align="center" justify={"center"} width={"50%"}>
        <Button
          opacity={0.9}
          onClick={() => {
            handleStudyNowButton();
          }}
          role="group"
          p="0"
          borderRadius={"12px"}
          bg="red.800"
          outlineOffset="4px"
          border="none"
          _hover={{
            bg: "red.800",
            opacity: 1,
          }}
          _active={{
            bg: "red.800",
          }}
        >
          <Text
            transform={"translateY(-6px)"}
            bg={"red.700"}
            borderRadius={"12px"}
            color="white"
            display={"block"}
            p="3"
            fontWeight={"light"}
            fontSize={"sm"}
            _active={{
              transform: "translateY(-2px)",
            }}
          >
            Study Now
          </Text>
        </Button>
      </Flex>
    </>
  );
};

export default DeckOverview;
