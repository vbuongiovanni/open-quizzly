import React, {useEffect, useState} from "react";
import LoginPage from "./components/LoginPage";
import MainMenu from "./components/MainMenu";
import {Route, Routes} from "react-router-dom";
import "./styles.css";
import QuizDetailPage from "./components/quiz-components/QuizDetailPage";
import Quiz from "./components/quiz-components/Quiz";

function App() {

  return (
    <>
      <Routes>
        <Route
            path="/"
            element={<LoginPage/>}
        />
        <Route
            path="/menu/"
            element={<MainMenu/>}
        />
        <Route
            path="/quiz/:quizId"
            element={<QuizDetailPage/>}
        />
        <Route
            path="/quiz/active/:quizId"
            element={<Quiz/>}
        />
      </Routes>
    </>
  );
}

export default App;
