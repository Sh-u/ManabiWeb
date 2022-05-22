import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import {
  GetMyDecksDocument,
  MeDocument,
  namedOperations,
  useGetMyDecksLazyQuery,
  useGetMyDecksQuery,
  useLoginMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
const Login = () => {
  const [login] = useLoginMutation();
  const router = useRouter();
  const {refetch} = useGetMyDecksQuery();
  return (
    <Flex
      h={"full"}
      maxW="full"
      justifyContent="center"
      alignItems="center"
      mt={"300px"}
      flexFlow="column"
    >
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values.username.includes("@")
              ? {
                  options: {
                    email: values.username,
                    password: values.password,
                  },
                }
              : { options: values },
            update(cache, { data }) {
              if (data.login.errors) {
                return;
              }

              cache.writeQuery({
                query: MeDocument,
                data: {
                  me: data.login.user,
                },
              });



            },
            refetchQueries: [
              {
                query: GetMyDecksDocument,
              }     
            ]
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data?.login.errors));
          } else if (response.data?.login.user) {
          
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username or email"
            />
            <InputField
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />

            <Box display={"flex"} justifyContent="center" alignItems="center">
              <Button
                mt={4}
                mr={"5px"}
                color={"black"}
                backgroundColor={"gray.400"}
                onClick={() => router.back()}
                type="button"
                _hover={{
                  transform: "scale(1.05)",
                  color: "white",
                }}
              >
                Back
              </Button>
              <Button
              
                mt={4}
                colorScheme="messenger"
                isLoading={isSubmitting}
                type="submit"
                _hover={{
                  transform: "scale(1.05)",
                  color: "white",
                }}
              >
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      <Box mt={"20px"}>
        <NextLink href="/register">
          <Link>Create an account</Link>
        </NextLink>
      </Box>
      <Box mt={"5px"}>
        <NextLink href="/forgotpassword">
          <Link>Forgot Password?</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};

export default Login;
