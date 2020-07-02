import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "./styles/index.css";

// Sections
import { Listings } from "./sections/Listings";

const client = new ApolloClient({
  uri: "/api",
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Listings title="Tiny House Listings" />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
