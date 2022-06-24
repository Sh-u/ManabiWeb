import { Flex, Text, Button } from "@chakra-ui/react";
import React from "react";
import { Deck, DeckResponse, FindDeckQuery, Maybe } from "../generated/graphql";
import AddCard from "./AddCard";

interface DeckOverviewProps {
  data: FindDeckQuery;
  handleStudyNowButton: () => void;
}

const DeckOverview = ({ data, handleStudyNowButton }: DeckOverviewProps) => {
  return (
    <>
      <Flex
        rounded="2xl"
        flexDir={"column"}
        justify="center"
        align="center"
        mt="5"
        h='full'
      >
        <Text fontSize={"3xl"} fontWeight="bold">
          {data?.findDeck?.decks[0]?.title}
        </Text>

        <Flex alignItems="center" justify={"center"} w="full" h="full">
          <Flex
            flexDir={"column"}
            alignItems="center"
            justify={"center"}
            w="50%"
            h="full"
          >
            <Flex>
              New: <Text ml="5">{data?.findDeck?.decks[0]?.cards?.length}</Text>
            </Flex>
            <Flex>
              Learning: <Text ml="5">0</Text>
            </Flex>
            <Flex>
              To Review: <Text ml="5">0</Text>
            </Flex>
          </Flex>
          <Flex
            flexDir={"column"}
            align="center"
            justify={"center"}
            w="50%"
            h="full"
          >
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
        </Flex>
      </Flex>
    </>
  );
};

export default DeckOverview;
