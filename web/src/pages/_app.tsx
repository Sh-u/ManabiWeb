
import {
  ApolloProvider
} from "@apollo/client";
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import theme from '../theme';
import { client } from './client';



function MyApp({ Component, pageProps }) {
  return (
  <ApolloProvider client={client}>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    </ApolloProvider>
  )
  
}

export default MyApp
