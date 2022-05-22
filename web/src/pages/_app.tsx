import { ApolloProvider } from "@apollo/client";
import {
  ChakraProvider,
  ColorModeProvider,
  useColorMode,
} from "@chakra-ui/react";
import theme from "../theme";
import { client } from "./client";
import { AppProps } from "next/app";
import { useCallback, useEffect } from "react";
import ForceDarkMode from "../utils/ForceDarkMode";
import {
  RecoilRoot,

} from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
       <RecoilRoot>
      <ChakraProvider resetCSS theme={theme}>
        <ForceDarkMode>
          <Component {...pageProps} />
        </ForceDarkMode>
      </ChakraProvider>
      </RecoilRoot>
    </ApolloProvider>
  );
}

export default MyApp;
