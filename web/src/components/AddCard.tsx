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

import { showCreateCardState } from "../atoms/showCreateCardState";
import useColors from "../hooks/useColors";
import { useCreateCardMutation } from "../generated/graphql";

const AddCard = ({ currentDeckId }: { currentDeckId: number }) => {
  const [image, setImage] = useState({ url: null, image: null });
  const [audio, setAudio] = useState({ url: null, audio: null });
  const [showCreateCard, setCreateCardState] =
    useRecoilState(showCreateCardState);


  const { getColor } = useColors();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createCard] = useCreateCardMutation();

  useEffect(() => {
    if (!showCreateCard) {
      return;
    }
    onOpen();
  }, [showCreateCard]);

  const handleOnClose = () => {
    if (!showCreateCard) return;
    setCreateCardState(!showCreateCard);
    onClose();
  };

  const handleImageState = (image, url) => {
    setImage({ url, image });
  };

  const handleAudioState = (audio, url) => {
    setAudio({ url, audio });
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

                const checkValues = () => {
                  const errObj = {};

                  if (values.Sentence.length < 1) {
                    errObj["Sentence"] = "Input is too short";
                  }
                  if (values.Word.length < 1) {
                    errObj["Word"] = "Input is too short";
                  }
                  console.log(JSON.stringify(errObj));
                  return errObj;
                };


                const response = await createCard({
                  variables: {
                    audio: audio?.audio,
                    deckId: currentDeckId,
                    image: image?.image,
                    options: {
                      sentence: values.Sentence,
                      word: values.Word,
                    },
                  },
                });

                if (
                  !response ||
                  response?.data?.createCard?.error ||
                  response?.errors
                ) {
                  console.log("error", response?.data?.createCard?.error);

                  setErrors(checkValues());
                  return;
                }

                console.log("success ", response?.data?.createCard?.card);
                setAudio(null);
                setImage(null);
                values.Sentence = "";
                values.Word = "";

              }}
            >
              {({ values, handleChange, isSubmitting, errors }) => (
                <Box width={"full"} p="5">
                  <Form>
                    <FormControl>
                      <Field name="Sentence">
                        {({ field: sentenceField, form }) => (
                          <Textarea
                            isInvalid={Object.hasOwn(errors, "Sentence")}
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
                            isInvalid={Object.hasOwn(errors, "Word")}
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
                        <Box>
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
                            />
                            <CloseIcon
                              margin={"auto"}
                              h={"10"}
                              w={"10"}
                              top="2"
                              right="5"
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

                      <Flex flexDir={"column"} justify="center" align="start">
                        <Player
                          marginTop={"10"}
                          isUsers={false}
                          url={
                            "https://sounds.soundofgothic.pl/assets/gsounds/INFO_BAU_2_WICHTIGEPERSONEN_15_00.WAV"
                          }
                        />

                        {audio?.url ? (
                          <Flex
                            position="relative"
                            justify={"center"}
                            align="center"
                            bg="gray.500"
                            mt="5"
                          >
                            <CloseIcon
                              position={"absolute"}
                              h={"5"}
                              w={"5"}
                              right="-10"
                              cursor={"pointer"}
                              _hover={{
                                color: "red.500",
                              }}
                              onClick={() => {
                                setAudio({ audio: null, url: null });
                              }}
                            />
                            <Player url={audio.url} isUsers={true} />
                          </Flex>
                        ) : null}
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
                            setCreateCardState(false);
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

export default AddCard;
