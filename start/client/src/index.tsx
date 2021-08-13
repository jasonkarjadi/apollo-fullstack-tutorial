import {
  ApolloClient,
  ApolloProvider,
  gql,
  NormalizedCacheObject,
  useQuery,
} from "@apollo/client";
import { cache as emotionCache } from "@emotion/css";
import { CacheProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom";
import { cache } from "./cache";
import Pages from "./pages";
import Login from "./pages/login";
import injectStyles from "./styles";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: "http://localhost:4000/graphql",
  headers: {
    authorization: localStorage.getItem("token") || "",
  },
  typeDefs,
});

injectStyles();

ReactDOM.render(
  <ApolloProvider client={client}>
    <CacheProvider value={emotionCache}>
      <IsLoggedIn />
    </CacheProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
