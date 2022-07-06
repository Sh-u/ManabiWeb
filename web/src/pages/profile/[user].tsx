import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { HiClock, HiPencil, HiSearch, HiUserGroup } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import {
  FindUserDocument,
  FindUserQuery,
  useFollowUserMutation,
  useGetFriendsQuery,
  useMeQuery,
} from "../../generated/graphql";
import useColors from "../../hooks/useColors";
import { client } from "../client";

interface FoundUser {
  foundUser: {
    __typename?: "User";
    _id: number;
    username: string;
    image?: string;
    createdAt: any;
    badge: string;
    dayStreak: number;
    cardStudied: number;
    following?: {
      __typename?: "User";
      _id: number;
      username: string;
    }[];
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
    if (!loggedUserData?.me) {
      router.push("/login");
      return;
    }

    const response = await followUser({
      variables: {
        targetUserId: foundUser?._id,
      },
    });

    if (!response) {
      console.log("follow error");
    }

    console.log("success", response?.data?.followUser);
    refetchFriends();
    router.replace(router.asPath);
  };

  console.log(foundUser);

  const { data: loggedUserData, loading: loadingLoggedUserInfo } = useMeQuery();

  const { data: getFriendsData,loading: loadingFriends, refetch: refetchFriends } = useGetFriendsQuery({
    variables: {
      targetUserId: foundUser?._id,
    },
  });

  const image = foundUser?.image;

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "New":
        return "green";

      case "Improving":
        return "yellow";

      case "Scholar":
        return "blue";

      case "Card Master":
        return "red";
    }
  };

  if (loadingLoggedUserInfo) {
    return <Spinner color="red.800" />;
  }
  const FollowButtonCheck = (
    <Button variant={"outline"} onClick={() => handleFollow()}>
      {foundUser?.followers.find((user) => user._id === loggedUserData?.me?._id)
        ? "Unfollow"
        : "Follow"}
    </Button>
  );

  const EditButtonCheck =
    loggedUserData?.me?._id === foundUser?._id ? (
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
          <Flex align="center" justify={"center"} w="full">
            <Avatar
              src={image ? "/" + image : null}
              name={foundUser?.username}
              bg="red.400"
              size={"2xl"}
            />
            <Flex align="start" justify={"center"} flexDir="column" ml="3">
              <Flex justify="center" align="center">
                <Text fontSize={"3xl"} fontWeight="semibold">
                  {foundUser?.username}
                </Text>
                <Badge ml="2" colorScheme={getBadgeColor(foundUser?.badge)}>
                  {foundUser?.badge}
                </Badge>
              </Flex>
              <Flex fontSize={"sm"} align="center" justify={"center"}>
                <Icon as={HiClock} /> <Text ml="2">joined on: {createdAt}</Text>
              </Flex>
              <Flex fontSize={"sm"} align="center" justify={"center"}>
                <Icon as={HiUserGroup} />{" "}
                <Text ml="2">
                  Followers: {foundUser?.followers?.length} / Following:{" "}
                  {foundUser?.following?.length}
                </Text>
              </Flex>
              <Image
                boxSize="30px"
                borderRadius="md"
                src="/jpFlag.svg"
                alt="jp"
              />
            </Flex>
          </Flex>
          <Box opacity={0} w="full">
            empty
          </Box>
          <Flex w="full" justify={"center"}>
            {EditButtonCheck}
          </Flex>
        </Flex>

        <Divider mt="10" />

        <Flex align="start" justify={"space-around"} w="full" h="full">
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
              color={foundUser?.dayStreak === 0 ? "gray.400" : "gray.100"}
              opacity={foundUser?.dayStreak === 0 ? 0.5 : 1}
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
                  <Text fontWeight={"bold"} fontSize="lg">
                    {foundUser?.dayStreak}
                  </Text>
                  <Text>Day Streak</Text>
                </Flex>
              </Flex>
            </Box>
            <Box
              outline={"2px solid #718096"}
              rounded="xl"
              p="2"
              w="10vw"
              color={foundUser?.cardStudied === 0 ? "gray.400" : "gray.100"}
              opacity={foundUser?.cardStudied === 0 ? 0.5 : 1}
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
          <Box opacity={0} w="full">
            empty
          </Box>

          <Flex
            align="start"
            justify="center"
            flexDir={"column"}
            px="12"
            mt="5"
            h="full"
            w="full"
          >
            {loadingFriends ? (
              <Spinner color="red.800" size='lg'/>
            ) : (
              <>
                <Text fontSize={"2xl"} fontWeight="semibold">
                  Friends
                </Text>
                {getFriendsData?.getFriends.length ? (
                  <Flex>
                    {getFriendsData?.getFriends.map((friend, index) => (
                      <Flex key={index}>
                        <NextLink href={`${friend.username}`}>
                          <Link
                            style={{ textDecoration: "none" }}
                            display="inline-flex"
                          >
                            <Avatar
                              bg="red.400"
                              name={friend?.username}
                              size="xs"
                              src=""
                            />

                            <Text ml="2" fontSize="lg">
                              {friend.username}
                            </Text>
                          </Link>
                        </NextLink>
                      </Flex>
                    ))}
                  </Flex>
                ) : (
                  <Text fontSize={"lg"}>Seems like no one is here 😭</Text>
                )}

                {loggedUserData?.me?._id === foundUser?._id ? (
                  <Button variant={"outline"} mt="5">
                    <Icon as={HiSearch} />
                    <Text ml="2">Find friends</Text>
                  </Button>
                ) : null}
              </>
            )}
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
