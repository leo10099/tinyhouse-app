import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

// Styles
import "./styles/index.css";

// Sections
import { Home, Host, Listing, Listings, NotFound, User } from "./sections";

const client = new ApolloClient({
  uri: "/api",
});
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/host" component={Host}></Route>
        <Route exact path="/listing/:id" component={Listing}></Route>
        <Route exact path="/listings/:location?" component={Listings}></Route>
        <Route exact path="/user/:id" component={User}></Route>
        <Route component={NotFound}></Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
