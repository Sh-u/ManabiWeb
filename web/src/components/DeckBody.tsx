import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showCreatePostState } from "../atoms/showCreatePostState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import { useFindDeckQuery } from "../generated/graphql";

const DeckBody = () => {
  const currentDeck = useRecoilValue(currentDeckBodyInfoState);

  const [createPost, setCreatePost] = useRecoilState(showCreatePostState);
  console.log('deck body')
  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const { data, error, loading } = useFindDeckQuery({
    variables: {
      _id: currentDeck,
    },
  });

  useEffect(() => {
    console.log("find deck: ", data?.findDeck);
    console.log("find deck error: ", error);
  }, [loading]);

  return (
    <Flex
      mt="5"
      bg="gray.700"
      width={"auto"}
      h="lg"
      rounded="lg"
      ml="300px"
      mr="300px"
      flexDir={"column"}
    >
      <Flex minH="20%" minW="full" flexDir={"column"}>
        <Flex align="center" justify={"space-evenly"} mt="5">
          <Button
            variant={"link"}
            onClick={() => setShowDeckBody(!showDeckBody)}
          >
            Decks
          </Button>
          <Text>Stats</Text>
          <Button
            variant={"link"}
            onClick={() => {
              setCreatePost(!createPost);
            }}
          >
            Add
          </Button>
        </Flex>
        <Flex align="center" justify={"center"} mt="5">
          <Text fontSize={"3xl"}>{data?.findDeck?.decks[0]?.title}</Text>
        </Flex>
      </Flex>
      <Flex minH="80%">
        <Flex
          flexDir={"column"}
          alignItems="center"
          justify={"center"}
          width={"50%"}
        >
          <Flex>
            New: <Text ml="5">0</Text>
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
          width={"50%"}
        >
          <Button fontSize={"lg"}>Study Now!</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DeckBody;
