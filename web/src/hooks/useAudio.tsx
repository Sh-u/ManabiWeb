import { useState, useEffect, useCallback } from "react";

const useAudio = (url: string): { audio: HTMLAudioElement, playing: Boolean, toggle: () => void} => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  };

  console.log('render')

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {

    const stopPlaying = () => {
     
        console.log("ended event -> stopPlaying");
        setPlaying(false);
      
    }
    audio.addEventListener("ended", stopPlaying);

    return () => {
      console.log('cleanup')
      audio.pause();
      audio.removeEventListener("ended", stopPlaying);
    };
  }, []);

  

  return { audio, playing, toggle};
};

export default useAudio;
