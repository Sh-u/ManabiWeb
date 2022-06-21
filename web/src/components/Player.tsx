import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import useAudio from "../hooks/useAudio";

export type myInput = {
  url: string;
  isUsers?: boolean;
  marginTop?: string;

};

const Player = ({ url, isUsers, marginTop }: myInput) => {

  const { playing, toggle, audio } = useAudio(url);


  return (
    <Flex position={"relative"} align="center" justify="start" mt={marginTop}>
      <Button
        onClick={() => {
          toggle();
        }}
      >
        {playing ? "Pause" : "Play"}
      </Button>
      <Text ml="5">{isUsers ? "Your audio" : "Dictionary audio"}</Text>
    </Flex>
  );
};

export default Player;
