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
import { Tooltip } from "@chakra-ui/react";
import useColors from "../hooks/useColors";
import { client } from "../pages/client";
import EditCardModal from "./EditCardModal";
import Player from "./Player";

type PitchAccentColorType = {
  color: "red" | "blue" | "orange" | "green";
  type: "atamadaka" | "heiban" | "nakamadaka" | "odaka";
};

export type CardStateEnum = "STUDY" | "ANSWER" | "EDIT";

interface StudyCardProps {
  deckId: number;
  setShowStudyCard: () => void;
}

const StudyCard = ({ deckId, setShowStudyCard }: StudyCardProps) => {
  const { getColor } = useColors();

  const checkPitchColor = (high: Array<boolean>): PitchAccentColorType => {
    if (high[0]) {
      return {
        color: "red",
        type: "atamadaka",
      };
    }
    if (high.slice(1).every((h) => h === true)) {
      return {
        color: "blue",
        type: "heiban",
      };
    }
    if (!high[0] && high[1] && high[2]) {
      return {
        color: "orange",
        type: "nakamadaka",
      };
    } else {
      return {
        color: "green",
        type: "odaka",
      };
    }
  };

  const [revisionTime, setRevisionTime] = useState({
    AGAIN: null,
    GOOD: null,
  });
  const [cardState, setCardState] = useState<CardStateEnum>("STUDY");
  console.log("study card");
  const {
    data: studyCardQuery,
    loading: studyCardloading,
    refetch,
  } = useGetStudyCardQuery({
    fetchPolicy: "no-cache",
    onError(error) {
      console.log(`err, `, error);
    },
  });
  console.log("study card");
  const foundCard = studyCardQuery?.getStudyCard;

  useEffect(() => {
    console.log("effect");
    if (!foundCard && !studyCardloading) {
      console.log("xd");
      setShowStudyCard();
    }

    if (!foundCard) return;
    console.log("foundcard", foundCard);
    const fetchData = async () => {
      const response = await client.query({
        query: GetRevisionTimeDocument,

        variables: {
          currentCardId: foundCard?._id,
        },
      });

      if (response) {
        console.log("get revision response", response?.data);
        setRevisionTime({ ...response?.data.getRevisionTime });
      }
    };
    fetchData();
  }, [studyCardQuery]);

  if (!studyCardQuery?.getStudyCard) {
    return (
      <Center mt="20">
        <Spinner color="red.800" />
      </Center>
    );
  }

  console.log(`data`, studyCardQuery?.getStudyCard);

  const sentence = foundCard?.sentence;
  const word = foundCard?.word;
  const furigana = foundCard?.furigana;
  const pitchAccent = foundCard?.pitchAccent;
  const image = foundCard?.image;
  const dictionaryAudio = foundCard?.dictionaryAudio;
  const dictionaryMeaning = foundCard?.dictionaryMeaning;
  const userAudio = foundCard?.userAudio;
  const cardId = foundCard?._id;

  console.log("accent", pitchAccent[0]?.high);
  const editProps = {
    cardState: cardState,
    cardId: cardId,
    sentence: sentence,
    word: word,
    userImage: image,
    dictionaryAudio: dictionaryAudio,
    userAudio: userAudio,
    setCardState: setCardState,
    refetchCard: refetch,
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
            <Tooltip
              placement="right"
              label={checkPitchColor(pitchAccent[0]?.high).type}
              top="0"
            >
              <Flex fontSize={"5xl"}
           
              flexDir='column'
                justify="center"
                align="center"
                mt="5"
                color={
                  pitchAccent
                    ? checkPitchColor(pitchAccent[0]?.high).color
                    : null
                }
              >
                <Text fontWeight={'bold'} >「{word}」</Text>
                <Text fontWeight={'semibold'} fontSize={"2xl"}>
                  {furigana}
                </Text>
              </Flex>
            </Tooltip>
            <Text fontSize="9xl">{pitchAccent[0]?.high[0]}</Text>

            <Text fontSize={"xl"} mt="5">
              {dictionaryMeaning.toString().replaceAll(",", ", ") ?? null}
            </Text>
            {image ? <Image src={image} w="auto" maxH={"64"} /> : null}
            <Flex justify={"center"} align="center" mt="5">
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
                <Text>{revisionTime?.AGAIN}</Text>
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

                    refetch();
                  }}
                >
                  Again
                </Button>
              </Flex>

              <Flex justify={"center"} align="center" flexDir={"column"} ml="5">
                <Text>{revisionTime?.GOOD}</Text>
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
                    console.log("x");
                    refetch();
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
