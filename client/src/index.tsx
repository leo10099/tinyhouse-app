import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <div>TINY HOUSE</div>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
