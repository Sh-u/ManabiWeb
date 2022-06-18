import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Dropzone from "./Dropzone";
import Player from "./Player";

import { showCreatePostState } from "../atoms/showCreatePostState";
import useColors from "../hooks/useColors";

const Post = () => {
  const [image, setImage] = useState({ url: null, image: null });
  const [audio, setAudio] = useState({ url: null, audio: null });
  const [showDeleteIcon, setshowDeleteIcon] = useState(false);
  const [showCreatePost, setShowCreatePost] =
    useRecoilState(showCreatePostState);
  const { getColor } = useColors();
  const { isOpen, onOpen, onClose } = useDisclosure();




  useEffect(() => {
    console.log("post effect");
    if (!showCreatePost) {
      return;
    }
    onOpen();
  }, [showCreatePost]);

  const handleOnClose = () => {
    if (!showCreatePost) return;
    setShowCreatePost(!showCreatePost);
    onClose();
  }

  const handleDeleteClick = () => {
    if (!audio.url) {
      return;
    }
    setshowDeleteIcon(!showDeleteIcon);
  };

  const handleImageState = (image, url) => {
    setImage({ url, image });
  };

  const handleAudioState = (audio, url) => {
    setAudio({ url, audio });
  };

  const renderExitIcon = () => {
    return <CloseIcon w={50} h={50} />;
  };
  const uploadToServer = async (event) => {
    const body = new FormData();
    console.log(`body: `, body);
    if (image.image) {
      body.append("imageFile", image.image);
    }
    if (audio.audio) {
      body.append("audioFile", audio.audio);
    }

    console.log(`body2: `, body.get("audioFile"));

    const response = await fetch("/api/uploads", {
      method: "POST",
      body,
    });

    console.log(`response: `, response);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} >
        <ModalOverlay />
        <ModalContent width={"auto"}>
          <Flex
            
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            bg={getColor("gray.600", "gray.700")}
            h="full"
        
            rounded={"lg"}
          >
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (values, { setErrors }) => {}}
            >
              {({ values, handleChange, isSubmitting }) => (
                <Box width={"full"} p="5">
                  <Form>
                    <Textarea placeholder="Sentence" resize={"vertical"} />
                    <Textarea placeholder="Word" resize={"vertical"} mt="5" />
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                    >
                      <Box mt="5">
                        <Box>
                          <Dropzone
                            imageState={handleImageState}
                            audioState={handleAudioState}
                          />
                        </Box>
                        {image?.url ? (
                          <Flex
                            mt="5"
                            alignItems={"center"}
                            justifyContent="center"
                          >
                            <Image
                              maxH={"lg"}
                              src={image.url}
                              onMouseEnter={() => renderExitIcon()}
                              _hover={{
                                opacity: "0.5",
                              }}
                            />
                            <CloseIcon
                              margin={"auto"}
                              h={"10"}
                              w={"10"}
                              position="absolute"
                              p="2"
                              cursor={"pointer"}
                              _hover={{
                                color: "red.500",
                              }}
                              onClick={() => setImage(null)}
                            />
                          </Flex>
                        ) : (
                          <></>
                        )}
                      </Box>

                      <Flex
                        mt="5"
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Player
                          url={
                            "https://sounds.soundofgothic.pl/assets/gsounds/INFO_BAU_2_WICHTIGEPERSONEN_15_00.WAV"
                          }
                        />
                        <Text ml="5"> Dictionary audio</Text>
                      </Flex>
                      <Flex
                        mt="5"
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        {audio?.url ? (
                          <Flex alignItems={"center"} justifyContent="center">
                            <Player url={audio.url} />
                            <Text ml="5"> Your audio</Text>
                            <CloseIcon
                              ml="2"
                              h={"7"}
                              w={"7"}
                              transform={"auto"}
                              p="2"
                              cursor={"pointer"}
                              _hover={{
                                color: "red.500",
                              }}
                              onClick={() => setAudio(null)}
                            />
                          </Flex>
                        ) : (
                          <></>
                        )}
                      </Flex>
                      <Flex
                        cursor={"pointer"}
                        mt="10"
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <Button
                          variant={"solid"}
                          onClick={() => {
                            setShowCreatePost(false);
                            onClose();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          ml="5"
                          variant={"solid"}
                          onClick={uploadToServer}
                        >
                          Save
                        </Button>
                      </Flex>
                    </Flex>
                  </Form>
                </Box>
              )}
            </Formik>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Post;
