import {
  Avatar,
  Button,
  Center,
  Flex,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  DeckResponse,
  FindDeckDocument,
  FindDeckQuery,
  useMeQuery,
  useSubscribeToDeckMutation,
  useUnsubscribeToDeckMutation,
} from "../../generated/graphql";
import { client } from "../client";

const DeckPage = ({ decks }: DeckResponse) => {
  const router = useRouter();
  const refreshData = () => {
    console.log("refresh");
    router.replace(router.asPath);
  };
  const { data: userData, loading, error } = useMeQuery();

  const [subscribeToDeck, { error: subscribeToDeckError }] =
    useSubscribeToDeckMutation();
  const [unsubscribeToDeck] = useUnsubscribeToDeckMutation();
  const isSubscribedToDeck = () => {
    if (decks[0].subscribers.some((user) => user._id === userData?.me?._id)) {
      return true;
    }
    return false;
  };

  const image = userData?.me?.image;
  const isOwnerOfDeck = () => {
    if (userData?.me?.decks?.some((deck) => deck._id === decks[0]._id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!loading) {
      console.log("user: ", userData.me);
      console.log("rendered deck: ", decks[0]);
    }
  }, [loading, userData, decks]);

  const handleSubscribingToDeck = async () => {
    if (!userData.me && !loading) {
      router.push("/login");
      return;
    }

    if (isOwnerOfDeck()) {
      console.log(`isOwnerOfDeck `, isOwnerOfDeck());
      return;
    }
    if (isSubscribedToDeck()) {
      console.log(`isSubscribedToDeck `, isSubscribedToDeck());
      return;
    }

    const response = await subscribeToDeck({
      variables: {
        deckId: decks[0]._id,
      },
    });

    if (subscribeToDeckError) {
      console.log(`subscribeToDeckError `, subscribeToDeckError);
      return;
    }
    if (response?.data?.subscribeToDeck?.errors) {
      console.log(`response.errors `, response?.data?.subscribeToDeck?.errors);
      return;
    }

    console.log(response);
    refreshData();
  };

  const handleUnsubscribingToDeck = async () => {
    if (!userData.me && !loading) {
      router.push("/login");
      return;
    }
    if (isOwnerOfDeck()) {
      console.log(`isOwnerOfDeck `, isOwnerOfDeck());
      return;
    }
    if (!isSubscribedToDeck()) {
      console.log(`isSubscribedToDeck `, isSubscribedToDeck());
      return;
    }

    const response = await unsubscribeToDeck({
      variables: {
        deckId: decks[0]._id,
      },
    });

    if (!response) {
      console.log("unsubscribing failed");
      return;
    }
    refreshData();
  };

  return (
    <>
      <Navbar />
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
            <Avatar
              src={image ? "/" + image : null}
              name={userData?.me?.username}
              bg="red.400"
              ml="5"
            />
          </Tooltip>
        </Flex>
        <Flex align={"center"} justify={"center"} mt="5">
          <Text fontSize={"xl"}>description</Text>
        </Flex>
        <Flex align={"center"} justify={"center"} mt="5">
          <Text fontSize={"lg"}>Cards: {decks[0].cards?.length}</Text>
        </Flex>
        {isOwnerOfDeck() ? (
          <Text font->You are the owner of this deck</Text>
        ) : (
          <Flex align={"center"} justify={"center"} mt="5">
            {isSubscribedToDeck() ? (
              <Button onClick={handleUnsubscribingToDeck} fontSize={"sm"}>
                Unsubscribe to Deck
              </Button>
            ) : (
              <Button onClick={handleSubscribingToDeck}>
                Subscribe to deck
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const parsedUrl = query.title_id as String;

  const deckTitle = parsedUrl.substring(0, parsedUrl.indexOf("-"));
  const deckId = parseInt(
    parsedUrl.substring(parsedUrl.indexOf("-")).match(/(\d+)/)[0]
  );

  const { data } = await client.query<FindDeckQuery>({
    query: FindDeckDocument,
    variables: {
      _id: deckId,
    },
    fetchPolicy: "no-cache",
  });

  console.log(`subscribers :`, data.findDeck.decks[0].subscribers);

  if (!data?.findDeck?.decks) {
    console.log("cannot find deck");
    return {
      notFound: true,
    };
  }

  if (
    data?.findDeck?.decks[0]?.title !== deckTitle ||
    data?.findDeck?.decks[0]?._id !== deckId
  ) {
    console.log("check error");
    return {
      notFound: true,
    };
  }
  // console.log(data.findDeck.decks[0].subscribers);
  console.log(data.findDeck.decks[0].user.image);
  return {
    props: {
      decks: data.findDeck.decks,
    },
  };
};

export default DeckPage;
