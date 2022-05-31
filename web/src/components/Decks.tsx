import { ChevronDownIcon, SettingsIcon, DeleteIcon } from "@chakra-ui/icons";
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
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaPen, FaShare } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import {
  GetMyDecksQuery,
  GetMyDecksDocument,
  useCreateDeckMutation,
  useGetMyDecksQuery,
  useMeQuery,
} from "../generated/graphql";
import { DeckButton } from "./DeckButton";
import Post from "./Post";

const Decks = () => {
  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const [currentDeckBodyInfo, setCurrentDeckBodyInfo] = useRecoilState<
    number | undefined
  >(currentDeckBodyInfoState);


  const { data: decksData, loading, error } = useGetMyDecksQuery();
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

  const handleShowDeckBody = () => {
    setShowDeckBody(!showDeckBody);
  }
  const handleShowCurrentDeckInfo = (deckId) => {
    setCurrentDeckBodyInfo(deckId);
  }



  let decks = decksData?.getMyDecks?.decks;
  let orderedDecks = undefined;
  
  if (decks){
    orderedDecks = [...decks]?.sort((a,b) => (a._id > b._id) ? 1 : -1);
  }
  console.log(orderedDecks)   

  return (
    <Box>
      {decks ? (
        <Box>
          {
          
          orderedDecks?.map((deck) => (
           <DeckButton handleShowDeckBody={handleShowDeckBody} handleShowCurrentDeckInfo={handleShowCurrentDeckInfo} deck={deck} key={deck._id}/>
          
          ))
          }
        </Box>
      ) : (
        <Box textAlign={'center'}>{loading ? loading : decksData?.getMyDecks?.errors}</Box>
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
                        console.log("data", data);

                        const { getMyDecks }: GetMyDecksQuery = cache.readQuery(
                          {
                            query: GetMyDecksDocument,
                          }
                        );

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
