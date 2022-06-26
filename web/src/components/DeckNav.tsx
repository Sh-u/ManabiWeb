import { Flex, Button } from "@chakra-ui/react";
import React from "react";

interface DeckNavProps {
    setShowDeckBody: () => void;
    setShowCreateCard: () => void;
}

const DeckNav = ({setShowDeckBody, setShowCreateCard}: DeckNavProps) => {
  return (
    <>
      <Flex
        align="center"
        justify={"space-around"}
        mt="5"
        textUnderlineOffset={"2px"}
      >
        <Button
          fontSize={"lg"}
          _hover={{
            textDecoration: "underline",
          }}
          variant={"unstyled"}
          onClick={() => setShowDeckBody()}
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
            setShowCreateCard();
          }}
        >
          Add
        </Button>
      </Flex>
    </>
  );
};

export default DeckNav;
