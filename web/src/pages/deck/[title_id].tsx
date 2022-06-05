import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { DeckResponse, FindDeckDocument, FindDeckQuery, GetAllDecksDocument, namedOperations } from "../../generated/graphql";
import { client } from "../client";
import Router, { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";




const DeckPage = ({decks}: DeckResponse ) => {
  
  
  return (
  <Flex align={'center'} justify={'center'}>{decks[0].title}</Flex>
    )
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const parsedUrl = query.title_id as String;

  const deckTitle = parsedUrl.substring(0, parsedUrl.indexOf("-"));
  const deckId = parseInt(parsedUrl.match(/(\d+)/)[0]);



  const {data, loading, error} = await client.query<FindDeckQuery>({
    query: FindDeckDocument,
    variables: {
      _id: deckId
    },

  });

  


  if (!data?.findDeck?.decks){
    console.log('cannot found deck')
    return {
      notFound: true
    }
  }

  
   
    if (data?.findDeck?.decks[0]?.title !== deckTitle || data?.findDeck?.decks[0]?._id !== deckId){
      console.log('cchek error')
      return {
        notFound: true
      }
    }
  
  

  return {
    props: {
      decks: data.findDeck.decks,
    },
  };
};

export default DeckPage;
