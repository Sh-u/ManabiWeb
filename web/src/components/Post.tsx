import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Dropzone from "./Dropzone";
import Player from "./Player";

import { showCreatePostState } from "../atoms/showCreatePostState";
import useColors from "../hooks/useColors";
import { useCreatePostMutation } from "../generated/graphql";

const Post = ({ currentDeck }: { currentDeck: number }) => {
  const [image, setImage] = useState({ url: null, image: null });
  const [audio, setAudio] = useState({ url: null, audio: null });
  const [showDeleteIcon, setshowDeleteIcon] = useState(false);
  const [showCreatePost, setShowCreatePost] =
    useRecoilState(showCreatePostState);
  const { getColor } = useColors();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createPost] = useCreatePostMutation();

  const currentRef = useRef();
  useEffect(() => {
    if (!showCreatePost) {
      return;
    }
    onOpen();
  }, [showCreatePost]);

  const handleOnClose = () => {
    if (!showCreatePost) return;
    setShowCreatePost(!showCreatePost);
    onClose();
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
  const uploadToServer = async () => {
    if (!image.image && !audio.audio) return;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} autoFocus={false}>
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
              initialValues={{ Sentence: "", Word: "" }}
              onSubmit={async (values, { setErrors }) => {
                console.log(values);

                const checkValues = () => {
                  const errObj ={

                  }

                  if (values.Sentence.length < 1){
                    errObj["Sentence"] = 'Input is too short'
                  }
                  if (values.Word.length < 1){
                    errObj["Word"] = 'Input is too short'
                  }
                  console.log(JSON.stringify(errObj))
                  return errObj;
                }
                const response = await createPost({
                  variables: {
                    deckId: currentDeck,
                    image: image.image,
                    options: {
                      sentence: values.Sentence,
                      word: values.Word,
                    },
                  },
                });


                if (
                  !response ||
                  response?.data?.createPost?.error ||
                  response?.errors
                ) {
                  console.log("error", response?.data?.createPost?.error);

                  setErrors(checkValues());
                  return;
                }

                console.log("success ", response?.data?.createPost?.post);
              }}
            >
              {({ values, handleChange, isSubmitting, errors }) => (
                <Box width={"full"} p="5">
                  <Form>
                    <FormControl >
                      <Field name="Sentence">
                        {({ field: sentenceField, form }) => (
                          <Textarea
                          isInvalid={Object.hasOwn(errors, 'Sentence')}
                            {...sentenceField}
                            placeholder="Sentence"
                            resize={"vertical"}
                          />
                        )}
                      </Field>
                      {errors?.Sentence ? (
                        <FormErrorMessage>{errors.Sentence}</FormErrorMessage>
                      ) : null}
                      <Field name="Word">
                        {({ field: wordField }) => (
                          <Textarea
                          isInvalid={Object.hasOwn(errors, 'Word')}
                            {...wordField}
                            placeholder="Word"
                            resize={"vertical"}
                            mt="5"
                          />
                        )}
                      </Field>
                    </FormControl>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      flexDirection={"column"}
                    >
                      <Box mt="5">
                        <Box ref={currentRef}>
                          <Dropzone
                            imageState={handleImageState}
                            audioState={handleAudioState}
                          />
                        </Box>
                        {image?.url ? (
                          <Flex
                            role="group"
                            mt="5"
                            alignItems={"center"}
                            justifyContent="center"
                            position="relative"
                          >
                            <Image
                              _groupHover={{
                                opacity: "0.5",
                              }}
                              maxH={"lg"}
                              src={image.url}
                              onMouseEnter={() => renderExitIcon()}
                            />
                            <CloseIcon
                              margin={"auto"}
                              h={"10"}
                              w={"10"}
                              top="0"
                              right="0"
                              position="absolute"
                              p="2"
                              cursor={"pointer"}
                              _hover={{
                                color: "red.500",
                                opacity: 1,
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
                          Close
                        </Button>
                        <Button ml="5" variant={"solid"} type="submit">
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
