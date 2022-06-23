import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import useAudio from "../hooks/useAudio";
import { FaVolumeOff, FaVolumeUp } from "react-icons/fa";
export type myInput = {
  url: string;
  isUsers?: boolean;
  marginTop?: string;
  marginLeft?: string;
};

const Player = ({ url, isUsers, marginTop, marginLeft }: myInput) => {

  const { playing, toggle, audio } = useAudio(url);


  return (
    <Flex position={"relative"} align="center" justify="start" mt={marginTop} ml={marginLeft}>
      <Button
      cursor={'pointer'}
        variant={'unstyled'}
        onClick={() => {
          toggle();
        }}
        fontSize='3xl'
      >
        {playing ? <FaVolumeUp/> : <FaVolumeOff/>}
      </Button>
      <Text ml="5">{isUsers ? "Your audio" : "Dictionary audio"}</Text>
    </Flex>
  );
};

export default Player;
