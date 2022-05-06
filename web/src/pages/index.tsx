import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import { PostsDocument, PostsQuery } from "../generated/graphql";
import { client } from "./client";
const Index = ({ posts }: PostsQuery) => {
 

    

  return (

    <Box height="100vh" maxW={'7xl'} mx={'auto'}>
      <Navbar />

      {!posts ? (
        <div>no posts</div>
      ) : (
        posts.map((p) => (
          <Flex
            key={p._id + 100}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box key={p._id} mt="20px">
              {p.title}
            </Box>
          </Flex>
        ))
      )}
    </Box>
  );
};

export async function getServerSideProps() {
  const { data } = await client.query({
    query: PostsDocument,
  });

  return {
    props: {
      posts: data.posts,
    },
  };
}
export default Index;
