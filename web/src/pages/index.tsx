import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import {
  useCreateDeckMutation,
  useGetMyDecksQuery,
  useMeQuery,
} from "../generated/graphql";
import { FaPlusCircle } from "react-icons/fa";
import { useState } from "react";
import Post from "../components/Post";
import router from "next/router";
import React from "react";
import { Field, Form, Formik } from "formik";
import { toErrorMap } from "../utils/toErrorMap";
import InputField from "../components/InputField";
const Index = () => {
  const [showDeckCreation, setShowDeckCreation] = useState(false);
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

  console.log(decksQuery)

  if (decksQuery.data) {
    console.log(decksQuery.data);
  }

  return (
    <Box height="100vh" maxW={"7xl"} mx={"auto"}>
      <Navbar />
      {decksQuery.data?.getMyDecks?.decks ? (
        <Box>
          {decksQuery.data?.getMyDecks?.decks.map((deck) => (
            <Box>
              <Text> {deck.title}</Text>
              <Text>yes</Text>
            </Box>
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

                    console.log(values);
                    const response = await createDeck({ variables: values });
                    console.log(response)
                    if (response.data?.createDeck?.errors) {
                      setErrors({ title: response.data?.createDeck?.errors });
                    }
                  }}
                >
                  {(values,  isSubmitting, ) => (
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
                              {form.errors ? <FormErrorMessage>{form.errors.title}</FormErrorMessage>  : null}
                              <Checkbox mt={"5"} defaultChecked>
                                Japanese Template
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </ModalBody>

                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit" isLoading={isSubmitting}>
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
      {showDeckCreation ? <Post /> : null}
    </Box>
  );
};

export default Index;
