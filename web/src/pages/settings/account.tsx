import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Divider,
  Flex,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  useChangeEmailMutation,
  useChangeUsernameMutation,
  useForgotPasswordMutation,
  useMeQuery,
  useUploadAvatarMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

interface SaveChangesResponse {
  __typename?: string;
  user?: {
    __typename?: string;
    _id: number;
    username: string;
    email: string;
  };
  errors?: {
    __typename?: string;
    field: string;
    message: string;
  }[];
}

const AccountPage = () => {
  const { data: userData, loading } = useMeQuery();

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const [usernameChangeInput, setUsernameChangeInput] = useState("");
  const [emailChangeInput, setEmailChangeInput] = useState("");
  const [image, setImage] = useState({ file: null, url: null });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [uploadAvatar] = useUploadAvatarMutation();
  const [changeUsername] = useChangeUsernameMutation();
  const [changeEmail] = useChangeEmailMutation();
  const [forgotPassword] = useForgotPasswordMutation();

  const toast = useToast();

  const ShowResponseToast = (response?: SaveChangesResponse) => {
    if (toast.isActive("the-toast")) return;
    let title, description, status;
    if (response?.errors) {
      title = response.errors[0].field;
      description = response.errors[0].message;
      status = "error";
    } else {
      title = "Success";
      description = "Refresh page to see changes";
      status = "success";
    }
    toast({
      id: "the-toast",
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (!loading && !userData.me) {
      router.push("/login");
    }
  }, [loading, userData?.me]);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const cancelRef = useRef();

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

      setImage({ file: i, url: URL.createObjectURL(i) });
    }
  };

  const uploadToServer = async () => {
    if (!image) return;
    const response = await uploadAvatar({
      variables: {
        image: image.file,
      },
    });

    if (response?.errors) {
      console.log(response?.errors);
    }
  };

  const handleSaveChanges = async () => {
    if (usernameChangeInput.length > 0) {
      const response = await changeUsername({
        variables: {
          newUsername: usernameChangeInput,
        },
      });

      if (!response) {
        console.log("no response");
        return;
      }
      if (response?.errors || response?.data?.changeUsername?.errors) {
        console.log(response?.data?.changeUsername?.errors);
        setErrors(toErrorMap(response?.data?.changeUsername?.errors));
        console.log(errors);
        ShowResponseToast(response?.data?.changeUsername);
        return;
      }
      console.log(response);
    }

    if (emailChangeInput.length > 0) {
      const response = await changeEmail({
        variables: {
          newEmail: emailChangeInput,
        },
      });

      if (!response || response?.data?.changeEmail?.errors) {
        console.log("response error", response?.data?.changeEmail?.errors);
        ShowResponseToast(response?.data?.changeEmail);
        return;
      }
      console.log(response);
    }

    if (image) {
      try {
        await uploadToServer();
      } catch (err) {
        ShowResponseToast({
          errors: [
            {
              field: "image",
              message: "uploading image failed",
            },
          ],
        });
      }
    }
    ShowResponseToast();
    refreshData();
  };

  const handleResetPassword = () => {
    const response = forgotPassword({
      variables: {
        username: userData?.me?.username,
      },
    });

    if (!response) {
      ShowResponseToast({
        user: null,
        errors: [
          {
            field: "Password",
            message: "Something went wrong when trying to change password",
          },
        ],
      });
      return;
    }

    ShowResponseToast({
      user: null,
      errors: null,
    });
  };

  const SaveButton =
    usernameChangeInput.length > 0 ||
    emailChangeInput.length > 0 ||
    image?.url ? (
      <Button
        onClick={handleSaveChanges}
        p="0"
        borderRadius={"12px"}
        bg="red.800"
        outlineOffset="4px"
        border="none"
        _hover={{
          bg: "red.800",
        }}
        _active={{
          bg: "red.800",
        }}
      >
        <Text
          transform={"translateY(-6px)"}
          bg={"red.700"}
          borderRadius={"12px"}
          color="white"
          display={"block"}
          p="3"
          fontWeight={"semibold"}
          fontSize={"sm"}
          _active={{
            transform: "translateY(-2px)",
          }}
        >
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

        <Flex align={"start"} justify={"center"} mt="10" flexDir="column">
          <Flex align={"center"} justify={"center"} mt="10">
            <Text fontSize={"sm"} fontWeight="semibold">
              Username
            </Text>
            <Input
              focusBorderColor="red.800"
              name="Username"
              placeholder={userData?.me?.username}
              ml="5"
              rounded={"xl"}
              variant="filled"
              onChange={(event) => setUsernameChangeInput(event.target.value)}
              position="relative"
            />
          </Flex>
          <Flex align={"center"} justify={"center"} mt="10">
            <Text fontSize={"sm"} fontWeight="semibold">
              Email
            </Text>
            <Input
              focusBorderColor="red.800"
              name="Email"
              placeholder={userData?.me?.email}
              ml="5"
              rounded={"xl"}
              variant="filled"
              onChange={(event) => setEmailChangeInput(event.target.value)}
            />
          </Flex>

          <Flex align={"center"} justify={"center"} mt="10">
            <Text fontSize={"sm"} fontWeight="semibold">
              Password
            </Text>
            <Button
              ml="5"
              rounded="lg"
              variant={"outline"}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Flex>

          <Flex align={"center"} justify={"center"} mt="10">
            <Text fontSize={"sm"} fontWeight="semibold">
              Profile picture
            </Text>

            <FormLabel
              m="0"
              fontWeight={"bold"}
              fontSize="xl"
              htmlFor="myImage"
              cursor={"pointer"}
              p="2"
              rounded={"xl"}
              ml="5"
              h="auto"
              w="auto"
              bg="inherit"
              position={"relative"}
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "red.800",
              }}
              textUnderlineOffset={"2px"}
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
        </Flex>

        {image?.url ? <Avatar mt="10" size={"2xl"} src={image.url} /> : null}

        <Button
          variant={"unstyled"}
          color="red.800"
          fontWeight={"bold"}
          mt="10"
          onClick={onDeleteOpen}
          _hover={{
            color: "red.400",
          }}
        >
          DELETE MY ACCOUNT!
        </Button>
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
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
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onDeleteClose} ml={3}>
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
