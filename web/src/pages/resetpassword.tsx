import { Flex, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import router from 'next/router'
import React from 'react'
import InputField from '../components/InputField'
import { useForgotPasswordMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

const resetpassword = () => {
    const [forgotPassword] = useForgotPasswordMutation()
  return (
    
    <Flex
    mt={'40vh'}
    justifyContent="center"
    alignItems="center"
    
    flexFlow="column"
  >
    <Formik
      initialValues={{ username: "" }}
      onSubmit={async (values, { setErrors }) => {
          

         const response = await forgotPassword({variables: values});

         
        if (!response.data.forgotPassword){
            setErrors({
                username: "user not found"
            })
        }

      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <InputField
            name="username"
            label="Reset Your Password"
            placeholder="username"
          />
          <Box display={"flex"} justifyContent="center" alignItems="center" >
          <Button
              mt={4}
              mr={'5px'}
              color={'black'}
              backgroundColor={'gray.400'}
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
              colorScheme="red"
              color={'black'}
              isLoading={isSubmitting}
              type="submit"
              _hover={{
                transform: "scale(1.05)",
                color: "white",
              }}
            >
              Reset Password
            </Button>
         
          </Box>
        </Form>
      )}
    </Formik>
    </Flex>
    
  )
}

export default resetpassword