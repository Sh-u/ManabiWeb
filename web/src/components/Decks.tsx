import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import router from "next/router";
import React, { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { currentDeckBodyInfoState } from "../atoms/currentDeckBodyInfoState";
import { showDeckBodyState } from "../atoms/showDeckBodyState";
import {
  GetMyDecksDocument,
  GetMyDecksQuery,
  useCreateDeckMutation,
  useGetMyDecksQuery,
  useMeQuery,
} from "../generated/graphql";
import { DeckButton } from "./DeckButton";

const Decks = () => {
  const [showDeckBody, setShowDeckBody] =
    useRecoilState<boolean>(showDeckBodyState);

  const [currentDeckBodyInfo, setCurrentDeckBodyInfo] = useRecoilState<
    number | undefined
  >(currentDeckBodyInfoState);
  const meQuery = useMeQuery();
  const { data: decksData, loading, error, refetch } = useGetMyDecksQuery();

  const [createDeck] = useCreateDeckMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  console.log('decks')


  console.log(decksData?.getMyDecks)

  const handleDeckCreation = () => {
    if (!meQuery.data?.me) {
      router.push("/login");
      return;
    }
    onOpen();
  };

  const handleShowDeckBody = () => {
    setShowDeckBody(!showDeckBody);
  };
  const handleShowCurrentDeckInfo = (deckId) => {
    setCurrentDeckBodyInfo(deckId);
  };

  let decks = decksData?.getMyDecks?.decks;

  const decksErrors = decksData?.getMyDecks?.errors;

  let orderedDecks = undefined;

  if (decks) {
    orderedDecks = [...decks]?.sort((a, b) => (a._id > b._id ? 1 : -1));
  }
  const handleModalClose = () => {

    refetch();
    onClose();
  }

  return (
    <Box>
      {decks ? (
        <Box>
          {orderedDecks?.map((deck) => (
            <DeckButton
              handleShowDeckBody={handleShowDeckBody}
              handleShowCurrentDeckInfo={handleShowCurrentDeckInfo}
              deck={deck}
              key={deck._id}
            />
          ))}
        </Box>
      ) : (
        <Box textAlign={"center"} fontSize="2xl" mt="10">
          {loading ? <Spinner size="lg" color="red.800" /> : decksErrors}
        </Box>
      )}
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mt={"5"}
        flexDirection={"column"}
      >
        <Flex
          colorScheme="red"
          alignItems={"center"}
          justifyContent={"center"}
          mt={"3"}
          as={Button}
          cursor={"pointer"}
          onClick={handleDeckCreation}
          transition={"ease-in-out"}
          transitionDuration="100ms"
        >
          Create Deck
          {isOpen ? (
            <Modal
              initialFocusRef={initialRef}
              isOpen={isOpen}
              onClose={handleModalClose}
            >
              <ModalOverlay />
              <ModalContent>
                <Formik
                  initialValues={{ title: "", JP: true }}
                  onSubmit={async (values, { setErrors }) => {
                    console.log(values);
                    const response = await createDeck({
                      variables: values,
                      update(cache, { data }) {
                        console.log(data)
                        if (data.createDeck.errors) {
                          console.log(`2`, data.createDeck.errors);
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
                                errors: getMyDecks.errors,
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
                                errors: getMyDecks.errors,
                              },
                            },
                          });
                        }
                      },
                    });

                    if (response.data?.createDeck?.errors) {
                      console.log("after", decksData?.getMyDecks?.errors);
                      setErrors({ title: response.data?.createDeck?.errors });
                    } else if (response.data?.createDeck) {
                      handleModalClose();
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
                            <>
                              <FormControl isInvalid={form.errors.title}>
                                <FormLabel htmlFor="title">
                                  Deck Title
                                </FormLabel>
                                <Input
                                  focusBorderColor="red.800"
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
                              </FormControl>
                            </>
                          )}
                        </Field>
                        <Field name="JP">
                          {({ field, form }) => (
                            <>
                              <FormLabel htmlFor="JP">
                                <Checkbox
                                  {...field}
                                  id="JP"
                                  mt={"5"}
                                  defaultChecked
                                  colorScheme={"red"}
                                  checked={field.value}
                                >
                                  Japanese Template
                                </Checkbox>
                              </FormLabel>
                            </>
                          )}
                        </Field>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          mr={3}
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          Save
                        </Button>
                        <Button onClick={handleModalClose}>Cancel</Button>
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
