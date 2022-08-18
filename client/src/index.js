import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter, browserRouter} from "react-router-dom";
import { AppContextProvider } from "./components/AppContext";
import { UserContextProvider } from "./components/UserContext";
import { QuizContextProvider } from "./components/QuizContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <AppContextProvider>
        <BrowserRouter>
          <QuizContextProvider>
            <App />
          </QuizContextProvider>
        </BrowserRouter>
      </AppContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);