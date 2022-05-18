import { Box, Button } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
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
