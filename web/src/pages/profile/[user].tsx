import { GetServerSideProps } from 'next';
import React from 'react'
import { GetUsersDocument } from '../../generated/graphql';
import { client } from '../client';

const UserPage = (props) => {


  return (
    <div>{props.username}</div>
  )
}


export const getServerSideProps: GetServerSideProps = async ({query}) => {

    const {data} = await client.query({
        query: GetUsersDocument,
      });

console.log(data)
console.log('query', query)

      const inputedUser = query.username;
    if (data.username !== inputedUser){
        return {
            notFound: true
        }
    }
    

    
  
      return {
          props: {
            data
          }
      }
  }

export default UserPage