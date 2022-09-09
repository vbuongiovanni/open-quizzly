import React from "react";
import {Route, Routes} from "react-router-dom";
import Login from "./components/login-components/Login";
import MainMenu from "./components/MainMenu";
import QuizCreator from "./components/QuizCreator";
import UserStats from "./components/user-statistics-components/UserStats";
import QuizDetailPage from "./components/quiz-components/QuizDetailPage";
import Quiz from "./components/quiz-components/Quiz";
import "./styles.css";

const App = () => {

  return (
    <>
      <Routes>
        <Route
            path="/"
            element={<Login/>}
        />
        <Route
            path="/menu/"
            element={<MainMenu/>}
        />
        <Route
            path="/quiz/creator"
            element={<QuizCreator/>}
        />
        <Route
            path="/user/stats"
            element={<UserStats/>}
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
