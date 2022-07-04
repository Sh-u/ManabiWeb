import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { HiClock, HiPencil, HiSearch, HiUserGroup } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import {
  FindUserDocument,
  FindUserQuery,
  GetUsersDocument,
  GetUsersQuery,
  useFollowUserMutation,
  useMeQuery,
  useFindUserQuery,
} from "../../generated/graphql";
import useColors from "../../hooks/useColors";
import { client } from "../client";
import NextLink from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

interface FoundUser {
  foundUser: {
    __typename?: "User";
    _id: number;
    username: string;
    image?: string;
    createdAt: any;
    followers?: {
      __typename?: "User";
      _id: number;
      username: string;
    }[];
  };
}

const UserPage = ({
  foundUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { getColor } = useColors();
  const router = useRouter();
  let createdAt = foundUser?.createdAt?.toString();
  createdAt = createdAt.substring(0, createdAt.indexOf("T"));

  const [followUser] = useFollowUserMutation();

  const handleFollow = async () => {
    const response = await followUser({
      variables: {
        targetUserId: foundUser?._id,
      },
    });

    if (!response) {
      console.log("follow error");
    }

    console.log("success", response?.data?.followUser);
    router.replace(router.asPath);
  };

  console.log(foundUser?.followers);
  const { data: loggedUser, loading } = useMeQuery();
  const image = foundUser?.image;

  if (loading) {
    return <Spinner color="red.800" />;
  }
  const FollowButtonCheck = (
    <Button variant={"outline"} onClick={() => handleFollow()}>
      {foundUser?.followers.find((user) => user._id === loggedUser?.me?._id)
        ? "Unfollow"
        : "Follow"}
    </Button>
  );

  const EditButtonCheck =
    loggedUser?.me?._id === foundUser?._id ? (
      <NextLink href="/settings/account">
        <Link style={{ textDecoration: "none" }}>
          <Button
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
              <Icon as={HiPencil} transform="translate3d(-2px, 2px, 0)" />
              EDIT PROFILE
            </Text>
          </Button>
        </Link>
      </NextLink>
    ) : (
      FollowButtonCheck
    );

  return (
    <>
      <Navbar />

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
            <Avatar
              src={image ? "/" + image : null}
              name={foundUser?.username}
              bg="red.400"
              size={"2xl"}
            />
            <Flex align="start" justify={"center"} flexDir="column" ml="3">
              <Text fontSize={"3xl"} fontWeight="semibold">
                {foundUser?.username}
                <Badge ml="2" colorScheme="green">
                  New
                </Badge>
              </Text>
              <Flex fontSize={"sm"} align="center" justify={"center"}>
                <Icon as={HiClock} /> <Text ml="2">joined on: {createdAt}</Text>
              </Flex>
              <Flex fontSize={"sm"} align="center" justify={"center"}>
                <Icon as={HiUserGroup} />{" "}
                <Text ml="2">
                  Followers: {foundUser?.followers?.length} / Following: 0
                </Text>
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
    </>
  );
};

export const getServerSideProps: GetServerSideProps<FoundUser> = async ({
  query,
}) => {
  const inputedUser = query.user;

  // const { data, refetch: findUserRefetch } = useFindUserQuery({
  //   variables: {
  //     targetUsername: inputedUser.toString(),
  //   },
  // });

  const { data } = await client.query<FindUserQuery>({
    query: FindUserDocument,
    variables: {
      targetUsername: inputedUser.toString(),
    },
    fetchPolicy: "no-cache",
  });

  const foundUser = data?.findUser?.user;

  console.log(foundUser);
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
