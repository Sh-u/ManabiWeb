import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showCreatePostState } from "../atoms/showCreatePostState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import { useFindDeckQuery } from "../generated/graphql";
import useColors from "../hooks/useColors";
import Post from "./Post";

const DeckBody = () => {
  const currentDeck = useRecoilValue(currentDeckBodyInfoState);

  const [createPost, setCreatePost] = useRecoilState(showCreatePostState);
  console.log("deck body");
  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const { getColor } = useColors();

  const [showCreatePost, setShowCreatePost] =
    useRecoilState<boolean>(showCreatePostState);
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
      <Flex h="auto" w="full" flexDir={"column"} rounded="2xl">
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
              setCreatePost(!createPost);
            }}
          >
            Add
          </Button>
        </Flex>
        <Flex align="center" justify={"center"} mt="5">
          <Text fontSize={"3xl"} fontWeight="bold">
            {data?.findDeck?.decks[0]?.title}
          </Text>
        </Flex>
      </Flex>
      <Flex h="full" rounded="2xl">
        <Flex
          flexDir={"column"}
          alignItems="center"
          justify={"center"}
          width={"50%"}
        >
          <Flex flexDir={"column"} alignItems="start" justify={"center"}>
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
        </Flex>
        <Flex
          flexDir={"column"}
          align="center"
          justify={"center"}
          width={"50%"}
        >
          <Button
            opacity={0.9}
            onClick={() => {
              setShowCreatePost(showCreatePost);
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
      
      {showCreatePost ? <Post currentDeck={currentDeck} /> : null}
    </Flex>
  );
};

export default DeckBody;
