import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { UserContextProvider } from "./context/UserContext";
import { QuizContextProvider } from "./context/QuizContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <UserContextProvider>
          <QuizContextProvider>
            <App />
          </QuizContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);