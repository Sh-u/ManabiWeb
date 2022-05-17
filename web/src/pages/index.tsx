import { Box, Button, Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useGetMyDecksQuery } from "../generated/graphql";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import Post from "../components/Post";
const Index = () => {
  const [showPost, setShowPost] = useState(false);
  const decksQuery = useGetMyDecksQuery();

  if (decksQuery.data) {
    console.log(decksQuery.data);
  }

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {decksQuery.data?.getMyDecks?.decks ? (
        <Box>{decksQuery.data?.getMyDecks?.decks[0].title}</Box>
      ) : (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          mt={"5"}
          flexDirection={"column"}
        >
          <Box>{decksQuery.data?.getMyDecks?.errors}</Box>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            mt={"3"}
            cursor={"pointer"}
            onClick={() => setShowPost(true)}
            transition={"ease-in-out"}
            transitionDuration="100ms"
            _hover={{
              textDecoration: "underline",
              textUnderlinePosition: "under",
            }}
          >
            <Box>Create new deck: </Box>
            <Box ml={"3"}>
              <FaPlusCircle />
            </Box>
          </Flex>
        </Flex>
      )}
      {showPost ? <Post /> : null}
    </Box>
  );
};

export default Index;
