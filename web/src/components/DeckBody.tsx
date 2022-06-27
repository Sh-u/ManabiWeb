import { Button, Flex, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showCreateCardState } from "../atoms/showCreateCardState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";

import useColors from "../hooks/useColors";
import DeckOverview from "./DeckOverview";
import AddCard from "./AddCard";
import StudyCard from "./StudyCard";
import DeckNav from "./DeckNav";
import { useFindDeckQuery } from "../generated/graphql";


const DeckBody = () => {
  const currentDeck = useRecoilValue(currentDeckBodyInfoState);

  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const [showCreateCard, setShowCreateCard] = useRecoilState<boolean>(showCreateCardState)
  const [showStudyCard, setShowStudyCard] = useState(false);

  const { getColor } = useColors();

  console.log('body')

  const { data, error, loading, } = useFindDeckQuery({
    variables: {
      _id: currentDeck,
    },
    onCompleted({}) {
      console.log("completed");
    },
  });

 

  const handleStudyNowButton = () => {
    setShowStudyCard(!showStudyCard);
  };

  const handleSetShowDeckBody = useCallback(() => {
    setShowDeckBody(!showDeckBody)
  }, [])

  const handleSetShowCreateCard = useCallback(() => {
    console.log('craete card callback')
    setShowCreateCard(!showCreateCard)
  }, [])

  return (
    <Flex
      mt="5"
      bg={getColor("gray.400", "gray.800")}
      bgGradient={getColor(
        "linear(to-b, gray.50, white)",
        "linear(to-b, gray.800, gray.700)"
      )}
      border="1px solid"
      borderColor={getColor("gray.100", "gray.700")}
      width={"auto"}
      h="lg"
      rounded="2xl"
      mx={{ base: "xl", md: "350px  " }}
      flexDir={"column"}
    >
      <DeckNav setShowCreateCard={handleSetShowCreateCard} setShowDeckBody={handleSetShowDeckBody} />

      {showStudyCard ? (
        <StudyCard deckId={data?.findDeck?.decks[0]?._id} />
      ) : (
        <DeckOverview deckId={data?.findDeck?.decks[0]?._id} deckTitle={data?.findDeck?.decks[0]?.title} handleStudyNowButton={handleStudyNowButton} />
      )}

      {showCreateCard ? <AddCard currentDeckId={currentDeck} /> : null}
    </Flex>
  );
};

export default DeckBody;
