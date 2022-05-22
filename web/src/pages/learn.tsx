import { Box } from "@chakra-ui/react";
import React from "react";
import Decks from "../components/Decks";
import Navbar from "../components/Navbar";
import {
    useRecoilState,
    useRecoilValue,
  } from 'recoil';


import {showDeckBodyState} from '../atoms/showDeckBodyState'
import DeckBody from "../components/DeckBody";

const Learn = () => {

    const showBodyState = useRecoilValue(showDeckBodyState);

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>   
      <Navbar />
      {showBodyState ? <DeckBody/> : <Decks />}
      
    </Box>
  );
};

export default Learn;
