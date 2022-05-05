import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables
} from "@apollo/client";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import {
  MeDocument, useRegisterMutation
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

type registerProps = MutationFunctionOptions<
  any,
  OperationVariables,
  DefaultContext,
  ApolloCache<any>
> & {
  username: string;
  password: string;
};

const Register = () => {
  const [register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Flex
      h={"full"}
      maxW="full"
      justifyContent="center"
      alignItems="center"
      mt={"200px"}
    >
      <Formik
        initialValues={{email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: {options: values},
            update(cache, { data }) {
              cache.writeQuery({
                query: MeDocument,
                data: {
                  me: data.register.user,
                },
              });
            },
          });
          if (response.data?.register.errors) {
            console.log('errors')
            setErrors(toErrorMap(response.data?.register.errors));
          } else if (response.data.register.user){
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              label="Email"
              placeholder="email"
            />
            <InputField
              name="username"
              label="Username"
              placeholder="username"
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
                colorScheme="messenger"
                isLoading={isSubmitting}
                type="submit"
                _hover={{
                  transform: "scale(1.05)",
                  color: "white",
                }}
              >
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default Register;
