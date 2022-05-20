import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { Deck } from "../generated/graphql";

export const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  }),

  cache: new InMemoryCache({
    typePolicies: {
      DeckResponse: {
        keyFields: ["decks"],
        merge: true,
      },

    },
  }),
});

// export const client = new ApolloClient({

//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
//   cache: new InMemoryCache(),

// });
