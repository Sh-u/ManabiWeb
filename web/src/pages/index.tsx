import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  MeDocument,
  PostsDocument,
  PostsQuery,
  namedOperations,
  BasicUserFragment,
  useMeQuery,
  GetMyDecksDocument,
  GetMyDecksQuery,
  MeQuery,
  DeckResponse,
  usePostsQuery,
  MeQueryResult,
} from "../generated/graphql";
import { client } from "./client";
const Index = () => {

 const me = useMeQuery();

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />

    {me.data ? <Box>yes</Box> : <Box>no</Box>}
    </Box>
  );
};

// export async function getServerSideProps() {


//     const {data} = await client.query({
//       query: MeDocument,
//     });

//   console.log(data)
//   return {
//     props: {
//       me: data
//     }
//   }

  // const currentUser: MeQuery = meQuery.data;

  // console.log(meQuery);
  // if (!currentUser) {
  //   console.log("not loggend in");
  //   return {
  //     props: {},
  //   };
  // }

  // const decksQuery = await client.query({
  //   query: GetMyDecksDocument,
  // });

  // const myDecks: DeckResponse = decksQuery.data.getMyDecks;

  // if (myDecks.errors) {
  //   return {
  //     props: {},
  //   };
  // }

  // return {
  //   props: {},
  // };
// }

export default Index;
