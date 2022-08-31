import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import { AppContextProvider } from "./components/AppContext";
import { UserContextProvider } from "./components/UserContext";
import { QuizContextProvider } from "./components/quiz-components/QuizContext";

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