import React from "react";
import ReactDOM from "react-dom"; 
import App from "./App";
import { ConnectedRouter } from "connected-react-router";
import configureStore,  { history } from "./configureStore";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./provider.js";
const {store} = configureStore();
const MOUNT_NODE = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  MOUNT_NODE
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
