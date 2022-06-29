import { Flex, Text, Button, Center, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { showCreateCardState } from "../atoms/showCreateCardState";
import {
  Deck,
  DeckResponse,
  FindDeckQuery,
  Maybe,
  useGetLearnAndReviewCardsQuery,
} from "../generated/graphql";
import AddCard from "./AddCard";

interface DeckOverviewProps {
  deckTitle: string;
  deckId: number;
  handleStudyNowButton: () => void;
}

const DeckOverview = ({
  deckTitle,
  deckId,
  handleStudyNowButton,
}: DeckOverviewProps) => {

  if (!deckId) {
    return (
      <Center mt='32'>
        <Spinner color="red.800" size='xl'/>
      </Center>
    );
  }
  const { data: CardQuantity, loading, refetch } = useGetLearnAndReviewCardsQuery({
    variables: {
      deckId: deckId,
    },
  });

  
  const showCreateCard= useRecoilValue<boolean>(showCreateCardState)


  useEffect(() => {

    if (!loading && !showCreateCard) {
      console.log("refetch");
     refetch();
    }
  }, [showCreateCard]);

  return (
    <>
      <Flex
        rounded="2xl"
        flexDir={"column"}
        justify="center"
        align="center"
        mt="5"
        h="full"
      >
        <Text fontSize={"3xl"} fontWeight="bold">
          {deckTitle}
        </Text>

    {CardQuantity?.getLearnAndReviewCards?.learn.length || CardQuantity?.getLearnAndReviewCards?.review.length ? ( <Flex alignItems="center" justify={"center"} w="full" h="full">
          <Flex
            flexDir={"column"}
            alignItems="center"
            justify={"center"}
            w="50%"
            h="full"
          >
            <Flex color="red.300">
              Learning:{" "}
              <Text ml="5">
                {CardQuantity?.getLearnAndReviewCards?.learn?.length}
              </Text>
            </Flex>
            <Flex color="blue.300">
              To Review:{" "}
              <Text ml="5">
                {CardQuantity?.getLearnAndReviewCards?.review?.length}
              </Text>
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
        </Flex>) : (<Text>No cards to review, come back later.</Text>)}
       
      </Flex>
    </>
  );
};

export default DeckOverview;
