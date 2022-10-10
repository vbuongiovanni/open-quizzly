import {React, useContext} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Login from "./components/login-components/Login";
import MainMenu from "./components/MainMenu";
import QuizEditorList from "./components/quiz-creator-components/QuizEditorList";
import QuizEditLoader from "./components/quiz-creator-components/QuizEditLoader";
import QuizEditor from "./components/quiz-creator-components/QuizEditor";
import UserStats from "./components/user-statistics-components/UserStats";
import QuizDetailPage from "./components/quiz-components/QuizDetailPage";
import Quiz from "./components/quiz-components/Quiz";
import "./styles.css";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const {token} = useContext(UserContext).credentials;
  
  return (
    <>
      <Routes>
        <Route path="/" element={!token ? <Login/> : <Navigate to={"/menu"}/>}/>
        <Route
            path="/menu"
            element={<ProtectedRoute token={token} redirectRoute="/"><MainMenu/></ProtectedRoute>}
            />
        <Route
            path="/quiz/editor"
            element={<ProtectedRoute token={token} redirectRoute="/"><QuizEditorList/></ProtectedRoute>}
            /> 
        <Route
            path="/quiz/editor/:quizId"
            element={<ProtectedRoute token={token} redirectRoute="/"><QuizEditor/></ProtectedRoute>}
            /> 
        <Route
            path="/quiz/creator"
            element={<ProtectedRoute token={token} redirectRoute="/"><QuizEditor/></ProtectedRoute>}
            />
        <Route
            path="/user/stats"
            element={<ProtectedRoute token={token} redirectRoute="/"><UserStats/></ProtectedRoute>}
            />
        <Route
            path="/quiz/:quizId"
            element={<ProtectedRoute token={token} redirectRoute="/"><QuizDetailPage/></ProtectedRoute>}
            />
        <Route
            path="/quiz/active/:quizId"
            element={<ProtectedRoute token={token} redirectRoute="/"><Quiz/></ProtectedRoute>}
            />
      </Routes>
    </>
  );
};
export default App;
