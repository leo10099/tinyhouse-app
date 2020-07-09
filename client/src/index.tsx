import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Affix, Layout } from "antd";
import { Viewer } from "./lib/types";

// Styles
import "./styles/index.css";

// Sections
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  LogIn,
  NotFound,
  User,
} from "./sections";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequestGoogleInfo: false,
};

const client = new ApolloClient({
  uri: "/api",
});

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  return (
    <Router>
      <Layout id="app">
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route
            exact
            path="/login"
            render={(props) => <LogIn {...props} setViewer={setViewer} />}
          ></Route>
          <Route exact path="/host" component={Host}></Route>
          <Route exact path="/listing/:id" component={Listing}></Route>
          <Route exact path="/listings/:location?" component={Listings}></Route>
          <Route exact path="/user/:id" component={User}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Layout>
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
