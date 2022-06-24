import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FindDeckQuery } from "../generated/graphql";

import useColors from "../hooks/useColors";
import EditCardModal from "./EditCardModal";
import Player from "./Player";

interface DeckOverviewProps {
  data: FindDeckQuery;
}

export type CardStateEnum = "STUDY" | "ANSWER" | "EDIT";

const StudyCard = ({ data }: DeckOverviewProps) => {
  const { getColor } = useColors();

  // const [showAnswer, setShowAnswer] = useState(false);
  const [cardState, setCardState] = useState<CardStateEnum>("STUDY");

  const sentence = data?.findDeck?.decks[0]?.cards[0]?.sentence;
  const word = data?.findDeck?.decks[0]?.cards[0]?.word;
  const image = data?.findDeck?.decks[0]?.cards[0]?.image;
  const dictionaryAudio = data?.findDeck?.decks[0]?.cards[0]?.dictionaryAudio;
  const userAudio = data?.findDeck?.decks[0]?.cards[0]?.userAudio;
  const cardId = data?.findDeck?.decks[0]?.cards[0]?._id;

  console.log(word);

  const editProps = {
    cardState: cardState,
    cardId: cardId,
    sentence: sentence,
    word: word,
    userImage: image,
    dictionaryAudio: dictionaryAudio,
    userAudio: userAudio,
    setCardState: setCardState,
  };

  return (
    <>
      <Flex
        justify="flex-start"
        align="center"
        w="full"
        flexDir={"column"}
        p="5"
        h="full"
      >
        <Text fontSize={"3xl"}>{sentence}</Text>
        {cardState === "ANSWER" ? (
          <>
            <Text>{word}</Text>
            {image ? <Image src={image} w="auto" maxH={"64"} /> : null}
            <Flex justify={"center"} align="center">
              {dictionaryAudio ? (
                <Player isUsers={false} url={dictionaryAudio} />
              ) : null}
              {userAudio ? (
                <Player marginLeft="5" isUsers={true} url={userAudio} />
              ) : null}
            </Flex>
          </>
        ) : null}
        <Flex justify="space-between" align="end" w="full" px="5" h="full">
          <Button
            size="sm"
            onClick={() => {
              setCardState("EDIT");
            }}
          >
            Edit
          </Button>
          {cardState === "ANSWER" ? (
            <Flex justify={"center"} align="center">
              <Button
                _hover={{
                  bg: "red.600",
                }}
                bg="red.700"
              >
                Again
              </Button>
              <Button
                _hover={{
                  bg: "green.600",
                }}
                bg="green.700"
                ml="5"
              >
                Good
              </Button>
            </Flex>
          ) : (
            <Button size="md" onClick={() => setCardState("ANSWER")}>
              Show Answer
            </Button>
          )}

          <Box opacity={0}>empty</Box>
        </Flex>
        {cardState === "EDIT" ? <EditCardModal {...editProps} /> : null}
      </Flex>
    </>
  );
};

export default StudyCard;
