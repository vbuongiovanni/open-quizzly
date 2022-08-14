import React, {useEffect, useState} from "react";
import LoginPage from "./components/LoginPage"
import Navbar from "./components/Navbar";
import MainMenu from "./components/MainMenu";
import {Route, Routes} from "react-router-dom";
import "./styles.css";
import QuizDetailPage from "./components/quiz-components/QuizDetailPage";

function App() {

  const [credentials, setCredentials] = useState(undefined);  

  return (
    <>
      <Routes>
        <Route
            path="/"
            element={<LoginPage setCredentials={setCredentials} credentials={credentials}/>}
        />
        <Route
            path="/menu/"
            element={<MainMenu credentials={credentials}/>}
        />
        <Route
            path="/quiz/:quizId"
            element={<QuizDetailPage credentials={credentials}/>}
        />
      </Routes>
    </>
  );
}

export default App;
