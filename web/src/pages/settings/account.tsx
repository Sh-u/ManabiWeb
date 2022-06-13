import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Text,
  useDisclosure,
  Image,
  TagLabel,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useMeQuery } from "../../generated/graphql";

const AccountPage = () => {
  const { data, loading } = useMeQuery();

  const [usernameChangeInput, setUsernameChangeInput] = useState("");
  const [emailChangeInput, setEmailChangeInput] = useState("");
  const [image, setImage] = useState({ url: null, image: null });
  useEffect(() => {
    if (!loading && !data.me) {
      router.push("/login");
    }
  }, [loading, data?.me]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const isImage = (url) => {
    return /\.(jpg|jpeg|png)$/.test(url);
  };
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      if (!isImage(i.name)) {
        console.log("not image");
        return;
      }

      const fileSizeInMb = i.size / 1_000_000;

      if (fileSizeInMb >= 1) {
        console.log(fileSizeInMb);
        return;
      }

      setImage({ url: URL.createObjectURL(i), image: i });
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    console.log(`body: `, body);
    if (image.image) {
      body.append("imageFile", image.image);
    }

    console.log(`body2: `, body.get("audioFile"));

    const response = await fetch("/api/uploads", {
      method: "POST",
      body,
    });

    console.log(`response: `, response);
  };

  const SaveButton =
    usernameChangeInput.length > 0 || emailChangeInput.length > 0 || image.url ? (
      <Button p="3" rounded="xl" bg="red.800">
        <Text fontWeight={"extrabold"} fontSize={"sm"}>
          {" "}
          SAVE CHANGES
        </Text>
      </Button>
    ) : (
      <Button
        p="3"
        rounded="xl"
        bg="gray.600"
        pointerEvents={"none"}
        cursor="not-allowed"
        opacity={0.6}
        filter="alpha(opacity=65)"
        boxShadow={"none"}
      >
        <Text fontWeight={"extrabold"} fontSize={"sm"}>
          {" "}
          SAVE CHANGES
        </Text>
      </Button>
    );

  return (
    <>
      <Navbar />
      <Flex
        align={"center"}
        justify={"center"}
        flexDir="column"
        w="full"
        maxW="7xl"
        mx="auto"
        mt="10"
      >
        <Flex align={"center"} justify={"space-evenly"} w="full">
          <Text fontSize={"2xl"} fontWeight="semibold">
            Account settings
          </Text>
          {SaveButton}
        </Flex>
        <Divider mt="10" maxW={"3xl"} />
        <Flex align={"center"} justify={"center"} mt="10">
          <Text fontSize={"sm"} fontWeight="semibold">
            Username
          </Text>
          <Input
            placeholder={data?.me?.username}
            ml="5"
            rounded={"xl"}
            variant="filled"
            onChange={(event) => setUsernameChangeInput(event.target.value)}
          ></Input>
        </Flex>
        <Flex align={"center"} justify={"center"} mt="10">
          <Text fontSize={"sm"} fontWeight="semibold">
            Email
          </Text>
          <Input
            placeholder={data?.me?.email}
            ml="5"
            rounded={"xl"}
            variant="filled"
            onChange={(event) => setEmailChangeInput(event.target.value)}
          ></Input>
        </Flex>
        <Flex align={"center"} justify={"center"} mt="10">
          <Text fontSize={"sm"} fontWeight="semibold">
            Profile picture
          </Text>

          <FormLabel
            m="0"
            fontWeight={"bold"}
            htmlFor="myImage"
            cursor={"pointer"}
            p="2"
            rounded={"xl"}
            ml="5"
            h="auto"
            w="auto"
            bg="gray.600"
            position={"relative"}
          >
            Upload Image
          </FormLabel>
          <Input
            fontSize={"md"}
            fontWeight={"bold"}
            opacity="0"
            width={"0.1px"}
            height={"0.1px"}
            position="absolute"
            variant={"unstyled"}
            type="file"
            name="myImage"
            id="myImage"
            onChange={uploadToClient}
          />
        </Flex>

        {image.url ? <Image mt='10' h="auto" w="xs" src={image.url} /> : null}

        <Button variant={"unstyled"} color="red.500" mt="10" onClick={onOpen}>
          DELETE MY ACCOUNT!
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onClose} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </>
  );
};

export default AccountPage;
