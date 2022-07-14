import { Button, Divider, Flex, Text } from "@chakra-ui/react";
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
  const currentDeckId = useRecoilValue(currentDeckBodyInfoState);

  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const [showCreateCard, setShowCreateCard] = useRecoilState<boolean>(showCreateCardState)
  const [showStudyCard, setShowStudyCard] = useState(false);

  const { getColor } = useColors();

  console.log('deck body', currentDeckId)

  const { data, error, loading, } = useFindDeckQuery({
    variables: {
      _id: currentDeckId,
    },
    onCompleted() {

    },
  });

  useEffect(() => {
    console.log(`studycard state`, showStudyCard)
  }, [showStudyCard])
 

  const handleStudyNowButton = useCallback(() => {
    setShowStudyCard(!showStudyCard);
  },[])

  const handleSetShowDeckBody = useCallback(() => {
    setShowDeckBody(!showDeckBody)
  }, [])

  const handleSetShowCreateCard = useCallback(() => {
    console.log('craete card callback')
    setShowCreateCard(!showCreateCard)
  }, [])

  const handleSetShowStudyCard = useCallback(() => {
    console.log('study card callback')
    setShowStudyCard(false)
  }, [])

  return (
    <Flex
      mt="5"
      bg={getColor("gray.400", "gray.800")}
      width={"auto"}
      h="lg"
      rounded="2xl"
      mx={{ base: "xl", md: "350px  " }}
      flexDir={"column"}
    >
      <DeckNav setShowCreateCard={handleSetShowCreateCard} setShowDeckBody={handleSetShowDeckBody} />

 

      {showStudyCard ? (
        <StudyCard deckId={currentDeckId} setShowStudyCard={handleSetShowStudyCard}/>
      ) : (
        <DeckOverview deckId={currentDeckId} deckTitle={data?.findDeck?.decks[0]?.title} handleStudyNowButton={handleStudyNowButton} />
      )}

      {showCreateCard ? <AddCard currentDeckId={currentDeckId} /> : null}
    </Flex>
  );
};

export default DeckBody;
