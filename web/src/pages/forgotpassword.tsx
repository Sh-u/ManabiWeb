import { Flex, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import router from 'next/router'
import React, { useState } from 'react'
import InputField from '../components/InputField'
import { useForgotPasswordMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

const forgotpassword = () => {
    const [forgotPassword] = useForgotPasswordMutation()
    const [isSubmitted, setSubmitted] = useState(false)
  return (
    
    <Flex
    mt={'300px'}
    justifyContent="center"
    alignItems="center"
    
    flexFlow="column"
  >
    <Formik
      initialValues={{ username: "" }}
      onSubmit={async (values,{ setErrors }) => {
        setSubmitted(false)

         const response = await forgotPassword({variables: values});

         
        if (!response.data.forgotPassword){
            setErrors({
                username: "user not found"
            })

            return
        }

        setSubmitted(true);

      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <InputField
            name="username"
            label="Reset Your Password"
            placeholder="username"
          />
          {isSubmitted ? <Box mt={'5px'} color='green.300' fontSize='xs' >Instructions were sent to your email</Box> : <></>}
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

export default forgotpassword