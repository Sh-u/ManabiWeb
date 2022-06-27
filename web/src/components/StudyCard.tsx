import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ChooseCardDifficultyDocument,
  FindDeckQuery,
  GetRevisionTimeDocument,
  GetRevisionTimeQuery,
  useGetLearnAndReviewCardsLazyQuery,
  useGetLearnAndReviewCardsQuery,
  useGetRevisionTimeQuery,
  useGetStudyCardQuery,
} from "../generated/graphql";

import useColors from "../hooks/useColors";
import { client } from "../pages/client";
import EditCardModal from "./EditCardModal";
import Player from "./Player";

export type CardStateEnum = "STUDY" | "ANSWER" | "EDIT";

const StudyCard = ({ deckId }: { deckId: number }) => {
  const { getColor } = useColors();

  // const [showAnswer, setShowAnswer] = useState(false);
  const [cardState, setCardState] = useState<CardStateEnum>("STUDY");

  const { data: studyCardQuery, loading: studyCardloading } =
    useGetStudyCardQuery();

  const foundCard = studyCardQuery?.getStudyCard;

  useEffect(() => {
    if (!foundCard) return;
    const fetchData = async () => {
      const response = await client.query({
        query: GetRevisionTimeDocument,
        variables: {
          currentCardId: foundCard?._id,
        },
      });

      if (response) {
        getRevisionTime = response?.data;
      }
    };
    fetchData();
  }, [foundCard]);
  console.log(foundCard);

  if (studyCardloading) {
    return (
      <Center mt="20">
        <Spinner color="red.800" />
      </Center>
    );
  }

  let getRevisionTime: GetRevisionTimeQuery;

  const sentence = foundCard?.sentence;
  const word = foundCard?.word;
  const image = foundCard?.image;
  const dictionaryAudio = foundCard?.dictionaryAudio;
  const userAudio = foundCard?.userAudio;
  const cardId = foundCard?._id;

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
              <Flex justify={"center"} align="center" flexDir={"column"}>
                <Text>{getRevisionTime?.getRevisionTime?.AGAIN} m</Text>
                <Button
                  _hover={{
                    bg: "red.600",
                  }}
                  bg="red.700"
                  onClick={async () => {
                    const response = await client.mutate({
                      mutation: ChooseCardDifficultyDocument,
                      variables: {
                        currentCardId: foundCard?._id,
                        answerType: "AGAIN",
                      },
                    });

                    if (!response || !response.data) {
                      console.log("answer fail");
                    }
                    console.log(response?.data);
                  }}
                >
                  Again
                </Button>
              </Flex>

              <Flex justify={"center"} align="center" flexDir={"column"} ml="5">
                <Text>{getRevisionTime?.getRevisionTime?.GOOD} m</Text>
                <Button
                  _hover={{
                    bg: "green.600",
                  }}
                  bg="green.700"
                  onClick={async () => {
                    const response = await client.mutate({
                      mutation: ChooseCardDifficultyDocument,
                      variables: {
                        currentCardId: foundCard._id,
                        answerType: "GOOD",
                      },
                    });

                    if (!response || !response.data) {
                      console.log("answer fail");
                    }
                    console.log(response?.data);
                  }}
                >
                  Good
                </Button>
              </Flex>
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
