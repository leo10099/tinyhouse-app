import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

// Sections
import { Listings } from "./sections/Listings";

ReactDOM.render(
  <React.StrictMode>
    <Listings />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
