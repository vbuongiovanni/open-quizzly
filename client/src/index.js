import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter, browserRouter} from "react-router-dom";
import { AppContextProvider } from "./components/AppContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContextProvider>
  </React.StrictMode>
);