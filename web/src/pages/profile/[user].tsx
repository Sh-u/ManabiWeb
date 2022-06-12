import { Flex } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import Navbar from "../../components/Navbar";
import { GetUsersDocument, GetUsersQuery } from "../../generated/graphql";
import { client } from "../client";

interface FoundUser {
  foundUser: {
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
  return (
    <>
      <Navbar />
      <Flex mt="20" align="center" justify={"center"} fontSize="3xl" bg='gray.700' h='auto'>
        {foundUser?.username}
      </Flex>
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
