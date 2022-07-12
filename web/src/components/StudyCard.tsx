import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ChooseCardDifficultyDocument,
  GetRevisionTimeDocument,
  useGetStudyCardQuery,
} from "../generated/graphql";
import useColors from "../hooks/useColors";
import { client } from "../pages/client";
import EditCardModal from "./EditCardModal";
import Player from "./Player";

export type CardStateEnum = "STUDY" | "ANSWER" | "EDIT";

interface StudyCardProps {
  deckId: number;
  setShowStudyCard: () => void;
}

const smallKanas = ["ゃ", "ゅ", "ょ"];

const StudyCard = ({ deckId, setShowStudyCard }: StudyCardProps) => {
  const { getColor } = useColors();

  const checkPitchColor = (pitch: string, high?: boolean[]): string => {
    if (pitch === "unknown") {
      const firstHigh = wordHigh[0];

      if (firstHigh) {
        pitch = "atamadaka";
      } else {
        if (high?.slice(1).every((value) => value === true)) {
          pitch = "heiban";
        } else {
          pitch = "kihuku";
        }
      }
    }

    switch (pitch) {
      case "atamadaka":
        return "red.500";
      case "nakadaka":
        return "orange.400";
      case "odaka":
        return "green.400";
      case "kihuku":
        return "purple.400";
      case "heiban":
        return "blue.400";
    }
  };

  const [revisionTime, setRevisionTime] = useState({
    AGAIN: null,
    GOOD: null,
  });
  const [cardState, setCardState] = useState<CardStateEnum>("STUDY");
  // console.log("study card");
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
  // console.log("study card");
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
      <Center mt="40%">
        <Spinner color="red.800" size="xl" />
      </Center>
    );
  }

  // console.log(`data`, studyCardQuery?.getStudyCard);

  const sentence = foundCard?.sentence;
  const word = foundCard?.word;
  const furigana = foundCard?.furigana;
  const pitchAccentArray = foundCard?.pitchAccent;
  const image = foundCard?.image;
  const dictionaryAudio = foundCard?.dictionaryAudio;
  const dictionaryMeaning = foundCard?.dictionaryMeaning;
  const userAudio = foundCard?.userAudio;
  const cardId = foundCard?._id;

  const pitchAccentWord = pitchAccentArray?.find((o) => o.word === word);
  const wordHigh = pitchAccentWord?.high ? pitchAccentWord?.high : null;

  const coloredSentence =
    cardState === "ANSWER"
      ? foundCard?.sentenceArr?.map((word, index) => {
          const getMatchingWord = pitchAccentArray?.find(
            (o) => o.word === word
          );

          return (
            <Box
              position="relative"
              color={checkPitchColor(
                getMatchingWord?.descriptive,
                pitchAccentWord?.high
              )}
              key={index}
            >
              {word}
              <Text
                fontSize={"xs"}
                position="absolute"
                top="-3"
                whiteSpace={"nowrap"}
              >
                {getMatchingWord?.showKana ? getMatchingWord?.kana : null}
              </Text>
            </Box>
          );
        })
      : sentence;

  // console.log(" high", pitchAccentArray[0]?.high);
  // console.log("part", pitchAccentWord?.part);

  const smallHiragana = "ぁぃぅぇぉゃゅょゎ";
  const smallKatakana =
    "ァィゥェォヵㇰヶㇱㇲㇳㇴㇵㇶㇷㇷ゚ㇸㇹㇺャュョㇻㇼㇽㇾㇿヮ";
  const smallKana = smallHiragana + smallKatakana;
  const convertToMoras = (word: string): string[] => {
    let result = [];
    let mora = "";
    for (const char of word) {
      if (!smallKana.includes(char)) {
        if (mora.length > 0) {
          result.push(mora);
        }

        mora = "";
      }

      mora += char;
    }

    if (mora.length > 0) {
      result.push(mora);
    }
    return result;
  };

  console.log("furigana mora?", convertToMoras(furigana));
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

  const drawPitchBorders = () => {
    return pitchAccentWord?.part?.map((mora, i, parts) => {
      console.log("draw", mora);
      const currentHigh = wordHigh[i];
      const nextHigh = wordHigh[i + 1];

      const styles: any = { pr: "4px", pl: "4px" };
      if (currentHigh) {
        styles.borderTop = "1px solid";

        if (nextHigh === false) {
          styles.borderRight = "1px solid";
        }
      } else {
        styles.borderBottom = "1px solid";
        if (nextHigh === true) {
          styles.borderRight = "1px solid";
        }
      }

      return (
        <Text {...styles} key={i}>
          {mora}
        </Text>
      );
    });
  };

  const drawPitchBordersByMora = (moraDrop: number) => {
    return convertToMoras(pitchAccentWord?.kana).map((mora, i) => {
      const styles: any = { pr: "4px", pl: "4px" };
      if (moraDrop === 0) {
        styles.borderBottom = "1px solid";
        styles.borderRight = "1px solid";
      } else if (i === moraDrop - 1) {
        styles.borderTop = "1px solid";
        styles.borderRight = "1px solid";
      }

      return (
        <Text {...styles} key={i}>
          {mora}
        </Text>
      );
    });
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
        <Flex flexWrap={"wrap"} fontSize={"3xl"}>
          {coloredSentence}
        </Flex>
        {cardState === "ANSWER" ? (
          <>
            <Tooltip
              placement="right"
              label={pitchAccentWord?.descriptive}
              top="0"
            >
              <Flex
                fontSize={"5xl"}
                flexDir="column"
                justify="center"
                align="center"
                mt="5"
                color={
                  pitchAccentArray
                    ? checkPitchColor(
                        pitchAccentWord?.descriptive,
                        pitchAccentWord?.high
                      )
                    : null
                }
              >
                <Text fontWeight={"bold"}>「{word}」</Text>
                <Flex fontWeight={"semibold"} fontSize={"2xl"}>
                  {pitchAccentWord?.high ? drawPitchBorders() : drawPitchBordersByMora(pitchAccentWord?.mora)}
                </Flex>
              </Flex>
            </Tooltip>

            <Text fontSize={"xl"} mt="5">
              {dictionaryMeaning?.join(", ") ?? null}
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
                    setCardState("STUDY");
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
                    setCardState("STUDY");
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
