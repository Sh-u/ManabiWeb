import { Flex, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage  } from 'next'
import router from 'next/router'
import React from 'react'
import InputField from '../../components/InputField'
interface MyProps {
  props: {
    token: string
  }
}


const ChangePassword: InferGetServerSidePropsType<typeof getServerSideProps> = (props) => {
  console.log(props)
  
  return (
    <Flex
    mt={'300px'}
    justifyContent="center"
    alignItems="center"
    
    flexFlow="column"
  >
    <Formik
      initialValues={{ newPassword: "" }}
      onSubmit={async (values, { setErrors }) => {
          

      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <InputField
            name="newPassword"
            label="New Password"
            placeholder="password"
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
              Change Password
            </Button>
         
          </Box>
        </Form>
      )}
    </Formik>
    </Flex>
  )
}


export const getServerSideProps: GetServerSideProps = async ({query}) => {

  const token: string = query.token as string;

    return {
        props: {
          token
        }
    }
}

export default ChangePassword