import { Avatar, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  DeckResponse,
  FindDeckDocument,
  FindDeckQuery, useMeQuery, useSubscribeToDeckMutation
} from "../../generated/graphql";
import { client } from "../client";

const DeckPage = ({ decks }: DeckResponse) => {
  const router = useRouter();

  const { data: userData, loading, error } = useMeQuery();

  let isSubscribedToDeck;
  let isOwnerOfDeck;
  useEffect(() => {
    if (!loading) {
      console.log(userData.me);
      isSubscribedToDeck = decks[0].subscribers.some((user) => user._id === userData.me._id);
      isOwnerOfDeck = userData.me.decks.some((deck) => deck._id === decks[0]._id);
    }
  }, [loading]);
  const handleAddingDeck = async () => {
    if (!userData.me && !loading) {
      router.push("/login");
      return;
    }

    if (isOwnerOfDeck) return;
    if (isSubscribedToDeck) return;

    const [subscribeToDeck, {error}] = useSubscribeToDeckMutation();
    const response = await subscribeToDeck(({variables: {
      deckId: decks[0]._id
    }}))

    if (error){
      console.log(error)
    }
    if (response?.errors){
      console.log(response.errors)
    }
  

  };

  return (
    <Flex
      align={"center"}
      justify={"center"}
      flexDir="column"
      mt="10"
      bg="gray.700"
      w="full"
      h="auto"
      p="2"
    >
      <Flex align={"center"} justify={"center"}>
        <Text fontSize={"2xl"}>{decks[0].title}</Text>
        <Tooltip
          hasArrow
          label={decks[0].user.username}
          bg="gray.300"
          color="black"
        >
          <Avatar name="author" src="https://i.imgur.com/1M2viYL.png" ml="5" />
        </Tooltip>
      </Flex>
      <Flex align={"center"} justify={"center"} mt="5">
        <Text fontSize={"xl"}>description</Text>
      </Flex>
      <Flex align={"center"} justify={"center"} mt="5">
        <Text fontSize={"lg"}>Cards: {decks[0].posts.length}</Text>
      </Flex>
      <Flex align={"center"} justify={"center"} mt="5">
        {userData?.me?.decks?.map((myDeck) =>
          myDeck._id === decks[0]._id ||
          decks[0].subscribers.some((user) => user._id === userData.me._id) ? (
            <Text fontSize={"sm"}>This deck is already added</Text>
          ) : (
            <Button onClick={handleAddingDeck}>Add deck</Button>
          )
        )}
      </Flex>
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const parsedUrl = query.title_id as String;

  const deckTitle = parsedUrl.substring(0, parsedUrl.indexOf("-"));
  const deckId = parseInt(
    parsedUrl.substring(parsedUrl.indexOf("-")).match(/(\d+)/)[0]
  );

  const { data, loading, error } = await client.query<FindDeckQuery>({
    query: FindDeckDocument,
    variables: {
      _id: deckId,
    },
  });

  if (!data?.findDeck?.decks) {
    console.log("cannot found deck");
    return {
      notFound: true,
    };
  }

  if (
    data?.findDeck?.decks[0]?.title !== deckTitle ||
    data?.findDeck?.decks[0]?._id !== deckId
  ) {
    console.log("cchek error");
    return {
      notFound: true,
    };
  }

  return {
    props: {
      decks: data.findDeck.decks,
    },
  };
};

export default DeckPage;
