import {useState, useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {AppContext} from "./../../context/AppContext";
import QuizEditor from "./QuizEditor";

const QuizEditLoader = () => {
  
  const {quizId} = useParams();
  const [quizData, setQuizData] = useState({});
  const {getQuiz} = useContext(AppContext);

  useEffect(() => {
    getQuiz(setQuizData, quizId);
  }, []);

  let initQuizDetails = {
    quizName : quizData.quizName ? quizData.quizName : "",
    subject : quizData.subject ? quizData.subject : ""
  }

  return (
    <QuizEditor quizData={quizData} quizId={quizId} initQuizDetails={initQuizDetails}/>
  );
};

export default QuizEditLoader;