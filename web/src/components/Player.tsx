import { Box, Button } from "@chakra-ui/react";
import useAudio from "../hooks/useAudio";

export type myInput = {
  url: string;
};

const Player = ({ url }: myInput) => {
  const [playing, toggle] = useAudio(url);

  return (
    <Box>
      <Button
        onClick={() => {
          toggle();
        }}
      >
        {playing ? "Pause" : "Play"}
      </Button>
    </Box>
  );
};

export default Player;
