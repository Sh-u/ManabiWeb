import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showCreatePostState } from "../atoms/showCreatePostState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import { useFindDeckQuery } from "../generated/graphql";
import useColors from "../hooks/useColors";
import DeckOverview from "./DeckOverview";
import Post from "./Post";
import StudyCard from "./StudyCard";

const DeckBody = () => {
  const currentDeck = useRecoilValue(currentDeckBodyInfoState);

  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);
  const [showCreatePost, setShowCreatePost] =
    useRecoilState<boolean>(showCreatePostState);

  const [showStudyCard, setShowStudyCard] = useState(false);

  const { getColor } = useColors();

  console.log("deckbody render");
  const { data, error, loading, refetch } = useFindDeckQuery({
    variables: {
      _id: currentDeck,
    },
    fetchPolicy: "no-cache",
    onCompleted({}) {
      console.log("completed");
    },
  });

  useEffect(() => {
    if (!loading && !showCreatePost) {
      console.log("refetch");
      refetch();
    }
  }, [showCreatePost]);

  const handleStudyNowButton = () => {
    setShowStudyCard(!showStudyCard);
  };

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
      <Flex h="auto" w="full" flexDir={"column"} rounded="2xl" >
        <Flex
          align="center"
          justify={"space-evenly"}
          mt="5"
          textUnderlineOffset={"2px"}
        >
          <Button
            fontSize={"lg"}
            _hover={{
              textDecoration: "underline",
            }}
            variant={"unstyled"}
            onClick={() => setShowDeckBody(!showDeckBody)}
          >
            Decks
          </Button>
          <Button
            _hover={{
              textDecoration: "underline",
            }}
            fontSize={"lg"}
            variant={"unstyled"}
          >
            Stats
          </Button>
          <Button
            _hover={{
              textDecoration: "underline",
            }}
            fontSize={"lg"}
            variant={"unstyled"}
            onClick={() => {
              setShowCreatePost(!showCreatePost);
            }}
          >
            Add
          </Button>
        </Flex>
        {showStudyCard ? null : (
          <Flex align="center" justify={"center"} mt="5">
            <Text fontSize={"3xl"} fontWeight="bold">
              {data?.findDeck?.decks[0]?.title}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex h="full" rounded="2xl">
        {showStudyCard ? (
          <StudyCard data={data} />
        ) : (
          <DeckOverview
            data={data}
            handleStudyNowButton={handleStudyNowButton}
          />
        )}
      </Flex>

      {showCreatePost ? <Post currentDeck={currentDeck} /> : null}
    </Flex>
  );
};

export default DeckBody;
