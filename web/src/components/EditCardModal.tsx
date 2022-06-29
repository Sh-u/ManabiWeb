import { ApolloQueryResult } from "@apollo/client";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  FormControl,
  Textarea,
  FormErrorMessage,
  Flex,
  Image,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";

import React, { useEffect, useState } from "react";
import Dropzone from "../components/Dropzone";
import { GetStudyCardQuery, useEditCardMutation } from "../generated/graphql";
import useColors from "../hooks/useColors";
import Player from "./Player";
import { CardStateEnum } from "./StudyCard";

interface EditCardModalProps {
  cardId: number;
  sentence: string;
  word: string;
  cardState: string;
  dictionaryAudio: string;
  userAudio: string;
  userImage: string;
  setCardState: React.Dispatch<React.SetStateAction<CardStateEnum>>;
  refetchCard: () => void; 
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  sentence,
  word,
  cardState,
  cardId,
  dictionaryAudio,
  userAudio,
  userImage,
  setCardState,
  refetchCard
}) => {
  const [editPost] = useEditCardMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState({ url: null, image: null });
  const [audio, setAudio] = useState({ url: null, audio: null });

  const { getColor } = useColors();

  const handleImageState = (image, url) => {
    setImage({ url, image });
  };

  const handleAudioState = (audio, url) => {
    setAudio({ url, audio });
  };

  useEffect(() => {
    console.log(cardState);

    if (cardState === "EDIT" && !isOpen) {
      onOpen();
    }
  }, [cardState]);

  useEffect(() => {
    if (!image.url) {
      setImage({ url: userImage, image: null });
    }
    if (!audio.url){
        setAudio({ url: userAudio, audio: null });
    }
  }, [userImage, userAudio]);

  const handleDeletingImage = () => {
    setImage({ url: null, image: null });

    userImage = null;
  };

  const handleDeletingAudio = () => {
    userAudio = null;
    setAudio({ url: null, audio: null });
  };

  const handleClosingModal = () => {
    setCardState("STUDY");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClosingModal} autoFocus={false}>
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
              initialValues={{ Sentence: sentence, Word: word }}
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

                const response = await editPost({
                  variables: {
                    targetId: cardId,
                    audio: audio.audio,
                    image: image.image,
                    options: {
                      sentence: values.Sentence,
                      word: values.Word,
                    },
                  },
                });

                if (
                  !response ||
                  response?.data?.editCard?.error ||
                  response?.errors
                ) {
                  console.log("error", response?.data?.editCard?.error);

                  setErrors(checkValues());
                  return;
                }

                console.log("success ", response?.data?.editCard?.card);
                refetchCard();
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
                              src={image?.url}
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
                              onClick={() => handleDeletingImage()}
                            />
                          </Flex>
                        ) : null}
                      </Box>

                      <Flex flexDir={"column"} justify="center" align="start">
                        {audio?.url ? (
                          <Flex
                            position="relative"
                            justify={"center"}
                            align="center"
                            bg="gray.500"
                            mt="5"
                          >
                            <Player url={audio?.url} isUsers={true} />
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
                                handleDeletingAudio();
                              }}
                            />
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
                            handleClosingModal();
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

export default EditCardModal;
