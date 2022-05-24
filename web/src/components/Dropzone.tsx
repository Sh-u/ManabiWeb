import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Center, useColorModeValue, Icon, Input } from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";

const regex = /'.jpg'|'.png'/

const Dropzone = ({imageState: handleImageState, audioState: handleAudioState}) => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);

    const isImage = (url) => {
        return /\.(jpg|jpeg|png)$/.test(url);
      }

      const isAudio = (url) => {
        return /\.(mp3|wav|ogg)$/.test(url);
      }
    
    for (let item of acceptedFiles){
        if (isImage(item.name)){
            console.log('match imge')
            handleImageState(item, URL.createObjectURL(item));
            break;
        }
        if (isAudio(item.name)){
            console.log('match audio', item)
            handleAudioState(item, URL.createObjectURL(item))
            break;
        }
    }

   
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".png"],
      "audio/mp3": [".mp3", ".wav", ".ogg"]
    },
    maxFiles: 1,
    multiple: false,
  });

  const dropText = isDragActive
    ? "Drop the files here ..."
    : "Drag and drop your image here, or click to select files";

  const activeBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue(
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
