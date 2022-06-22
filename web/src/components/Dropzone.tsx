import {
  ForwardedRef,
  Ref,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { useDropzone } from "react-dropzone";
import { Center, Icon, Input } from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";
import useColors from "../hooks/useColors";
import { usePasteUpload } from "@rpldy/upload-paste";
import withPasteUpload from "@rpldy/upload-paste";
import usePaste from "../hooks/usePaste";

const regex = /'.jpg'|'.png'/;

interface DropzoneProps {
  imageState: (image: any, url: any) => void;
  audioState: (audio: any, url: any) => void;
}

const Dropzone = ({
  imageState: handleImageState,
  audioState: handleAudioState,
}: DropzoneProps) => {
  const { getColor } = useColors();

  const pressedKeys = async (event: ClipboardEvent) => {
    console.log("pressedKeys callback");
   
   onDrop(event.clipboardData.files)
  };

  usePaste(pressedKeys);

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);

    const isImage = (url) => {
      return /\.(jpg|jpeg|png)$/.test(url);
    };

    const isAudio = (url) => {
      return /\.(mp3|wav|ogg)$/.test(url);
    };

    for (let item of acceptedFiles) {
      if (isImage(item.name)) {
        console.log("match imge");
        handleImageState(item, URL.createObjectURL(item));
        break;
      }
      if (isAudio(item.name)) {
        console.log("match audio", item);
        handleAudioState(item, URL.createObjectURL(item));
        break;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".png", ".jpg"],
      "audio/mp3": [".mp3", ".wav", ".ogg"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const dropText = isDragActive
    ? "Drop the files here ..."
    : "Drag and drop your image here, or click to select files";

  const activeBg = getColor("gray.100", "gray.600");
  const borderColor = getColor(
    isDragActive ? "teal.300" : "gray.300",
    isDragActive ? "teal.500" : "gray.500"
  );

  return (
    <Center
      p={10}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon as={AiFillFileAdd} mr={2} />
      <p>{dropText}</p>
    </Center>
  );
};
export default Dropzone;
