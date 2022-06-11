import { DeleteIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPen, FaShare } from "react-icons/fa";
import {
  GetMyDecksDocument,
  GetMyDecksQuery,
  useDeleteDeckMutation,
  useRenameDeckMutation,
} from "../generated/graphql";
interface renameDeckProps {
  currentDeckID: number;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const DeckButton = ({
  deck,
  handleShowDeckBody,
  handleShowCurrentDeckInfo,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [removePopOver, setRemovePopOver] = useState(true);
  const [deleteDeck] = useDeleteDeckMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };
  const handleRemoveDeck = (currentDeckID: number) => {
    const response = deleteDeck({
      variables: {
        _id: currentDeckID,
      },
      update(cache) {
        if (!response) {
          console.log("here");
          return;
        }

        const { getMyDecks }: GetMyDecksQuery = cache.readQuery({
          query: GetMyDecksDocument,
        });

        cache.writeQuery({
          query: GetMyDecksDocument,
          data: {
            getMyDecks: {
              decks: getMyDecks.decks.filter(
                (deck) => deck._id !== currentDeckID
              ),
              errors: null,
            },
          },
        });
      },
    });
  };

  const handleShare = () => {
    if (!deck.title || !deck._id) return;

    const text = `localhost:3000/deck/${deck.title}-${deck._id}`;
    console.log(text);
    copyTextToClipboard(text)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });

    toast({
      title: "Link copied.",
      description: "You can share this deck now.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex flexDir={"column"} alignItems="center" key={deck._id}>
      <Flex mt="5" align="center" justify={"center"}>
        <Button
          onClick={() => {
            handleShowDeckBody();
            handleShowCurrentDeckInfo(deck._id);
          }}
          cursor={"pointer"}
          textAlign={"center"}
          maxW="full"
        >
          <Text>{deck.title}</Text>
        </Button>
        <Menu>
          <MenuButton cursor={"pointer"} ml="5" as={SettingsIcon} />

          <MenuList>
            <MenuItem icon={<FaPen />} onClick={() => setShowModal(!showModal)}>
              Rename
            </MenuItem>
            <MenuItem icon={<FaShare />} onClick={handleShare}>
              Share
            </MenuItem>

            <MenuItem icon={<DeleteIcon />} onClick={() => onOpen()}>
              Delete
            </MenuItem>
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
      {isOpen ? (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Deck
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleRemoveDeck(deck._id);
                    onClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      ) : null}
    </Flex>
  );
};

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
