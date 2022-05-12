import { Flex, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage  } from 'next'
import router, { useRouter } from 'next/router'
import React from 'react'
import InputField from '../../components/InputField'
import { MeDocument, useChangePasswordMutation } from '../../generated/graphql'
import { toErrorMap } from '../../utils/toErrorMap'
interface MyProps {
  props: {
    token: string
  }
}


const ChangePassword: InferGetServerSidePropsType<typeof getServerSideProps> = (props) => {
  
  
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  

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
          
        const respone = await changePassword({
          variables: {
            token: props.token,
            newPassword: values.newPassword
          },
          
          update(cache, {data}){
            if (data.changePassword.errors) {
              return;
            }

              cache.writeQuery({
              query: MeDocument,
              data: {
                me: data.changePassword.user,
              },
          })
        },
      })

      console.log(respone.data.changePassword)
      

        if (respone.data.changePassword.errors){
          setErrors(toErrorMap(respone.data.changePassword.errors))
        }
        else if  (respone.data.changePassword.user){
          console.log(respone.data.changePassword.user)
        router.push("/");
        }
        

      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form>
          <InputField
            name="newPassword"
            label="New Password"
            placeholder="password"
            type='password'
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