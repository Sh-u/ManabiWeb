import { CloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Image,
  Text,
  FormControl,
  Textarea,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import image from "next/image";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { DeckResponse, FindDeckQuery } from "../generated/graphql";
import useColors from "../hooks/useColors";
import Player from "./Player";

interface DeckOverviewProps {
  data: FindDeckQuery;
}

const StudyCard = ({ data }: DeckOverviewProps) => {
  const { getColor } = useColors();

  const [showAnswer, setShowAnswer] = useState(false);

  const word = data?.findDeck?.decks[0]?.posts[0]?.word;
  const image = data?.findDeck?.decks[0]?.posts[0]?.image;
  const dictionaryAudio = data?.findDeck?.decks[0]?.posts[0]?.dictionaryAudio;
  const userAudio = data?.findDeck?.decks[0]?.posts[0]?.userAudio;

  console.log(word);

  useEffect(() => {
    console.log(showAnswer);
  }, [showAnswer]);
  return (
    <>
      <Flex
        justify="flex-start"
        align="center"
        w="full"
        flexDir={"column"}
        p="5"
      >
        <Text fontSize={"3xl"}>
          {data?.findDeck?.decks[0]?.posts[0]?.sentence}
        </Text>
        {showAnswer ? (
          <>
            <Text>{word}</Text>
            {image ? <Image src={image} w='auto' maxH={'64'}/> : null}
            <Flex justify={"center"} align="center">
              {dictionaryAudio ? (
                <Player
                  isUsers={false}
                  url={
                    "https://sounds.soundofgothic.pl/assets/gsounds/INFO_BAU_2_WICHTIGEPERSONEN_15_00.WAV"
                  }
                />
              ) : null}
              {userAudio ? (
                <Player marginLeft="5" isUsers={true} url={userAudio} />
              ) : null}
            </Flex>
          </>
        ) : null}
        <Flex justify="space-between" align="end" w="full" px="5" h="full">
          <Button size="sm">Edit</Button>
          {showAnswer ? (
            <Flex justify={"center"} align="center">
              <Button _hover={{
                bg: 'red.600'
              }} bg='red.700'>Again</Button>
              <Button _hover={{
                bg: 'green.600'
              }} bg='green.700'  ml="5">Good</Button>
            </Flex>
          ) : (
            <Button size="md" onClick={() => setShowAnswer(!showAnswer)}>
              Show Answer
            </Button>
          )}

          <Box opacity={0}>empty</Box>
        </Flex>
      </Flex>

      {/* <Formik
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

            const response = await createPost({
              variables: {
                audio: audio.audio,
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
        </Formik> */}
    </>
  );
};

export default StudyCard;
