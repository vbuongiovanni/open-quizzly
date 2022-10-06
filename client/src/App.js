import {React, useContext} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Login from "./components/login-components/Login";
import MainMenu from "./components/MainMenu";
import QuizCreator from "./components/QuizCreator";
import UserStats from "./components/user-statistics-components/UserStats";
import QuizDetailPage from "./components/quiz-components/QuizDetailPage";
import Quiz from "./components/quiz-components/Quiz";
import "./styles.css";

const App = () => {
  const {token} = useContext(UserContext).credentials;
  
  return (
    <>
      <Routes>
      <Route path="/" element={!token ? <Login/> : <Navigate to="/menu"/>}/>
        <Route
            path="/menu"
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
