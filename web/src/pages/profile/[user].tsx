import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { HiClock, HiUserGroup, HiPencil, HiSearch } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import {
  GetUsersDocument,
  GetUsersQuery,
  useMeQuery,
} from "../../generated/graphql";
import { client } from "../client";
import useColors from "../../hooks/useColors";
interface FoundUser {
  foundUser: {
    createdAt?: Date;
    __typename?: string;
    _id: number;
    username: string;
    decks: {
      __typename?: string;
      _id: number;
      title: string;
      createdAt: string;
    }[];
  };
}

const UserPage = ({
  foundUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { getColor } = useColors();
  let createdAt = foundUser?.createdAt?.toString();
  createdAt = createdAt.substring(0, createdAt.indexOf("T"));

  const { data: loggedUser } = useMeQuery();

  const EditButtonCheck =
    loggedUser?.me?._id === foundUser?._id ? (
      <Button
        p="4"
        size={"lg"}
        rounded="xl"
        bg={getColor("red.600", "red.800")}
        _hover={{
          bg: getColor("red.500", "red.700"),
        }}
      >
        <Icon as={HiPencil} />
        <Text ml="1">Edit Profile</Text>
      </Button>
    ) : (
      <Button variant={"outline"}>Follow</Button>
    );

  return (
    <>
      <Navbar />
      <Box bg={getColor("white", "gray.800")}>
        <Flex
          maxW="7xl"
          mx={"auto"}
          mt="20"
          align="start"
          justify={"start"}
          flexDir="column"
          fontSize="3xl"
          h="auto"
          p="3"
        >
          <Flex align="center" justify={"space-around"} w="full">
            <Flex align="center" justify={"center"}>
              <Avatar src="" size={"2xl"} />
              <Flex align="start" justify={"center"} flexDir="column" ml="3">
                <Text fontSize={"3xl"} fontWeight="semibold">
                  {foundUser?.username}
                  <Badge ml="2" colorScheme="green">
                    New
                  </Badge>
                </Text>
                <Flex fontSize={"sm"} align="center" justify={"center"}>
                  <Icon as={HiClock} />{" "}
                  <Text ml="2">joined on: {createdAt}</Text>
                </Flex>
                <Flex fontSize={"sm"} align="center" justify={"center"}>
                  <Icon as={HiUserGroup} />{" "}
                  <Text ml="2">Followers: 0 / Following: 0</Text>
                </Flex>
                <Flex fontSize={"sm"} align="center" justify={"center"}>
                  🇯🇵
                </Flex>
              </Flex>
            </Flex>
            <Box opacity={0}>empty</Box>
            {EditButtonCheck}
          </Flex>
          <Divider mt="10" />

          <Flex align="center" justify={"space-around"} w="full">
            <Flex
              align="start"
              justify="center"
              flexDir={"column"}
              px="12"
              mt="5"
            >
              <Text fontSize={"2xl"} fontWeight="semibold">
                Stats
              </Text>

              <Box
                mt="5"
                outline={"2px solid #718096"}
                rounded="xl"
                p="2"
                w="10vw"
                color="gray.400"
                opacity={0.5}
              >
                <Flex align="center" justify="start">
                  <Text fontSize={"lg"}>🔥</Text>
                  <Flex
                    align="start"
                    justify="center"
                    flexDir={"column"}
                    fontSize="md"
                    ml="3"
                  >
                    <Text fontWeight={"bold"}>0</Text>
                    <Text>Day Streak</Text>
                  </Flex>
                </Flex>
              </Box>

              <Box
                outline={"2px solid #718096"}
                rounded="xl"
                p="2"
                w="10vw"
                color="gray.400"
                opacity={0.5}
                mt="10"
              >
                <Flex align="center" justify="start">
                  <Text fontSize={"lg"}>✨</Text>
                  <Flex
                    align="start"
                    justify="center"
                    flexDir={"column"}
                    fontSize="md"
                    ml="3"
                  >
                    <Text fontWeight={"bold"}>0</Text>
                    <Text>Cards Studied</Text>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Box opacity={0}>empty</Box>
            <Flex
              align="start"
              justify="center"
              flexDir={"column"}
              px="12"
              mt="5"
            >
              <Text fontSize={"2xl"} fontWeight="semibold" mt="5">
                Friends
              </Text>
              <Text fontSize={"lg"}>Seems like no one is here 😭</Text>
              {loggedUser?.me?._id === foundUser?._id ? (
                <Button variant={"outline"} mt="5">
                  <Icon as={HiSearch} />
                  <Text ml="2">Find friends</Text>
                </Button>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<FoundUser> = async ({
  query,
}) => {
  const { data } = await client.query<GetUsersQuery>({
    query: GetUsersDocument,
  });

  const inputedUser = query.user;
  const foundUser = data.getUsers.find((user) => user.username === inputedUser);

  if (foundUser) {
    return {
      props: {
        foundUser,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default UserPage;
