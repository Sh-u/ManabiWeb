import {
  Text,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import router from "next/router";
import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import {
  showDeckBodyState,

} from "../atoms/showDeckBodyState";
import {
  GetMyDecksQuery,
  GetMyDecksDocument,
  useCreateDeckMutation,
  useGetMyDecksQuery,
  useMeQuery,
} from "../generated/graphql";
import Post from "./Post";

const Decks = () => {
  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const [currentDeckBodyInfo, setCurrentDeckBodyInfo] = useRecoilState<
    number | undefined
  >(currentDeckBodyInfoState);

  const decksQuery = useGetMyDecksQuery();
  const meQuery = useMeQuery();
  const [createDeck] = useCreateDeckMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  const handleDeckCreation = () => {
    if (!meQuery.data?.me) {
      console.log("no user");
      router.push("/login");
      return;
    }
    onOpen();
  };
  console.log(`my decks `, decksQuery?.data?.getMyDecks?.decks);
  return (
    <Box>
      {decksQuery.data?.getMyDecks?.decks ? (
        <Box>
          {decksQuery.data?.getMyDecks?.decks.map((deck) => (
            <Flex
              flexDir={"column"}
              alignItems="center"
              key={deck.createdAt + 500}
            >
              <Button
                onClick={() => {
                  setShowDeckBody(!showDeckBody);
                  setCurrentDeckBodyInfo(deck._id);
                }}
                mt="5"
                cursor={"pointer"}
                textAlign={"center"}
                maxW="10%"
                key={deck.createdAt + 100}
              >
                <Text key={deck.createdAt}> {deck.title}</Text>
              </Button>
            </Flex>
          ))}
        </Box>
      ) : (
        <Box>{decksQuery.data?.getMyDecks?.errors}</Box>
      )}
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mt={"5"}
        flexDirection={"column"}
      >
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          mt={"3"}
          cursor={"pointer"}
          onClick={handleDeckCreation}
          transition={"ease-in-out"}
          transitionDuration="100ms"
          _hover={{
            textDecoration: "underline",
            textUnderlinePosition: "under",
          }}
        >
          <Box>Create new deck: </Box>
          <Box ml={"3"}>
            <FaPlusCircle />
          </Box>
          {isOpen ? (
            <Modal
              initialFocusRef={initialRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <Formik
                  initialValues={{ title: "" }}
                  onSubmit={async (values, { setErrors }) => {
                    const response = await createDeck({
                      variables: values,
                      update(cache, { data }) {
                        if (data.createDeck.errors) {
                          console.log("error updating cache =>  INDEX.tsx");
                          return;
                        }

                        const { getMyDecks }: GetMyDecksQuery = cache.readQuery(
                          {
                            query: GetMyDecksDocument,
                          }
                        );

                        // console.log(`my decks `, getMyDecks);
                        // console.log(`mutation data decks`, data.createDeck);

                        if (!getMyDecks.decks) {
                          console.log("no decks update");
                          cache.writeQuery({
                            query: GetMyDecksDocument,
                            data: {
                              getMyDecks: {
                                decks: [...data.createDeck.decks],
                                errors: data.createDeck.errors,
                              },
                            },
                          });
                        } else {
                          cache.writeQuery({
                            query: GetMyDecksDocument,
                            data: {
                              getMyDecks: {
                                decks: [
                                  ...data.createDeck.decks,
                                  ...getMyDecks.decks,
                                ],
                                errors: data.createDeck.errors,
                              },
                            },
                          });
                        }
                      },
                    });

                    if (response.data?.createDeck?.errors) {
                      setErrors({ title: response.data?.createDeck?.errors });
                    } else if (response.data?.createDeck) {
                      onClose();
                    }
                  }}
                >
                  {(values, isSubmitting) => (
                    <Form>
                      <ModalHeader>Create New Deck</ModalHeader>
                      <ModalCloseButton />

                      <ModalBody pb={6}>
                        <Field name="title">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.title}>
                              <FormLabel htmlFor="title">Deck Title</FormLabel>
                              <Input
                                {...field}
                                id="title"
                                placeholder="New deck title"
                                ref={initialRef}
                              />
                              {form.errors ? (
                                <FormErrorMessage>
                                  {form.errors.title}
                                </FormErrorMessage>
                              ) : null}
                              <Checkbox mt={"5"} defaultChecked>
                                Japanese Template
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </ModalContent>
            </Modal>
          ) : (
            <></>
          )}
        </Flex>
      </Flex>
      
    </Box>
  );
};

export default Decks;
