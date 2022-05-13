import {
  ApolloClient, createHttpLink, InMemoryCache
} from "@apollo/client";

export const client = new ApolloClient({
    ssrMode:true,
    link: createHttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include', 
       
    }),
  
  cache: new InMemoryCache(),
  ssrForceFetchDelay: 1000,
  
});




// export const client = new ApolloClient({
  
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
//   cache: new InMemoryCache(),

// });