import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPen, FaShare } from "react-icons/fa";
import {
  GetMyDecksDocument,
  useRenameDeckMutation
} from "../generated/graphql";

interface renameDeckProps {
  currentDeckID: number;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const RenameModal = ({
  currentDeckID,
  setShowModal,
  showModal,
}: renameDeckProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renameDeck, { error }] = useRenameDeckMutation();
  const initialRef = React.useRef();

  const toast = useToast();

  useEffect(() => {
    console.log(isOpen);
    if (!isOpen) {
      onOpen();
    }
  }, []);

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{ newTitle: "" }}
            onSubmit={async (values, { setErrors }) => {
              if (values.newTitle.length < 3) {
                setErrors({
                  newTitle: "Deck title must contain at least 3 characters",
                });

                return;
              }

              const response = await renameDeck({
                variables: {
                  _id: currentDeckID,
                  title: values.newTitle,
                },
                refetchQueries: [
                  {
                    query: GetMyDecksDocument,
                  },
                ],
              });
              if (response.errors) {
                console.log(response.errors);
              } else if (response?.data?.renameDeck) {
                console.log("success");
                onClose();
                setShowModal(!showModal);
                toast({
                  title: "Success.",
                  description: "You've successfuly renamed the deck.",
                  status: "success",
                  duration: 800,
                  isClosable: true,
                });
              }
            }}
          >
            {(values, isSubmitting) => (
              <Form>
                <ModalHeader>Rename this deck</ModalHeader>
                <ModalCloseButton onClick={() => setShowModal(!showModal)} />
                <ModalBody pb={6}>
                  <Field name={"newTitle"}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.newTitle}>
                        <FormLabel htmlFor="newTitle">New Title</FormLabel>
                        <Input
                          type={"text"}
                          {...field}
                          id="newTitle"
                          ref={initialRef}
                          placeholder="New title"
                        />
                        {form.errors ? (
                          <FormErrorMessage>
                            {form.errors.newTitle}
                          </FormErrorMessage>
                        ) : null}
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type={"submit"}
                    isLoading={isSubmitting}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      onClose();
                      setShowModal(!showModal);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export const DeckButton = ({
  deck,
  handleShowDeckBody,
  handleShowCurrentDeckInfo,
}) => {
  const [showModal, setShowModal] = useState(false);
  console.log(`showmodal `, showModal);

  return (
    <Flex flexDir={"column"} alignItems="center" key={deck.createdAt + 500}>
      <Flex mt="5" align="center" justify={"center"}>
        <Button
          onClick={() => {
            handleShowDeckBody();
            handleShowCurrentDeckInfo(deck._id);
          }}
          cursor={"pointer"}
          textAlign={"center"}
          maxW="full"
          key={deck.createdAt + 100}
        >
          <Text>{deck.title}</Text>
        </Button>
        <Menu>
          <MenuButton cursor={"pointer"} ml="5" as={SettingsIcon} />

          <MenuList>
            <MenuItem icon={<FaPen />} onClick={() => setShowModal(!showModal)}>
              Rename
            </MenuItem>
            <MenuItem icon={<FaShare />}>Share</MenuItem>
            <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {showModal ? (
        <RenameModal
          currentDeckID={deck._id}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      ) : null}
    </Flex>
  );
};
