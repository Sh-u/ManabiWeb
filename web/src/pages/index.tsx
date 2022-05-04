import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { MeDocument, PostsDocument, PostsQuery, usePostsQuery } from "../generated/graphql";
import { client } from "./client";

const Index = ({posts}: PostsQuery  ) => {

  
    

  return (
    <>
    <Navbar />
    
    {!posts ? <div>no posts</div> : posts.map((p) => (
      <Flex key={p._id + 100} alignItems={'center'} justifyContent={'center'}>
      <Box key={p._id} mt='20px'>{p.title}</Box>  
      </Flex>
    ))}
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: PostsDocument,
  });
  
  return {
    props: {
      posts: data.posts
    },
  };
}
 export default Index;
