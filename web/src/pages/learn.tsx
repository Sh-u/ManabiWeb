import { Box } from "@chakra-ui/react";
import {useRouter} from "next/router";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { showCreatePostState } from "../atoms/showCreatePostState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import DeckBody from "../components/DeckBody";
import Decks from "../components/Decks";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { useMeQuery } from "../generated/graphql";

const Learn = () => {
  const showBodyState = useRecoilValue(showDeckBodyState);

  const showCreatePost = useRecoilValue(showCreatePostState);
  const router = useRouter();

  const { data, loading } = useMeQuery();



  useEffect(() => {

    if (!loading && !data.me) {
      router.push('/')
      
  }
  }, [loading, data?.me])

  
  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {showBodyState ? <DeckBody/> : <Decks />}
      {showCreatePost ? <Post/> : null}
    </Box>
  );
};

export default Learn;
