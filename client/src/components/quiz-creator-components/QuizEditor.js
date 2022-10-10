import {useState, useContext, useEffect} from "react";
import {AppContext} from "../../context/AppContext";
import Header from "../Header";
import NavBar from '../navbar-components/NavBar';
import {useParams, useLocation} from "react-router-dom";
import QuizTopicInput from "./QuizTopicInput";
import {confirm} from "react-confirm-box";
import { timedUserMsg } from "../../modules/timedUserMsg";

const QuizEditor = props => {
  
  const {quizId} = useParams();
  const [quizData, setQuizData] = useState({
    quizName : "",
    subject : "",
    topics : []
  });
  const {getQuiz, postQuiz, editQuiz, deleteQuiz, navCallbacks : {navToMenu}} = useContext(AppContext);

  const initQuestion = {
    questionText : "",
    correctAnswer : "",
    incorrectAnswer1 : "",
    incorrectAnswer2 : "",
    incorrectAnswer3 : "",
    questionNumber : 1
  };

  const initTopic = {
    topicName : "",
    topicNumber : 1,
    questions : [initQuestion]
  };  

  const initQuizDetails = {
    quizName : "",
    subject : ""
  }

  // initialize state
    const [quizDetails, setQuizDetails] = useState(initQuizDetails);
    const [topics, setTopics] = useState([initTopic]);
    const [messageText, setMessageText] = useState("");


    const {pathname} = useLocation();
    
    useEffect(() => {
      if (quizId) {
        getQuiz(setQuizData, quizId);
        console.log(quizData)
        setQuizDetails({
          quizName : quizData.quizName || "",
          subject : quizData.subject || ""
        });
        setTopics(quizData.topics);
      } else {
        setQuizDetails(initQuizDetails);
        setTopics([initTopic]);
      }
    }, [quizData.topics.length, pathname]) 

  // handle quiz detail inputs
    const handleQuizDetailChange = e => {
      const {name, value} = e.target;
      setQuizDetails(prevDetails => ({...prevDetails, [name] : value}));
    };

  // function to handle confirmation of deletion
  const confirmExit = async (userQuestion, confirmText, cancelText, deleteHandler, event) => {
    const options = {
      labels: {
        confirmable: confirmText,
        cancellable: cancelText
      }
    };
    const userRes = await confirm(userQuestion, options);
    if (userRes) {
      deleteHandler(event)
    };
  };

  // handle new topic
    const createNewTopic = e => {
      setTopics(prevTopics => {
        const nextTopicNum = prevTopics.length + 1;
        return [...prevTopics, {...initTopic, topicNumber : nextTopicNum}];
      });
    };

    console.log(topics)
  // handle topic name change
    const handleTopicChange = e => {
      // get id of topic to delete
      const {id, name, value} = e.target
      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(id));
        return [...prevTopics.filter(topic => topic.topicNumber !== Number(id)), {...modTopic, [name] : value}];
      });
    };

  // handle deletion of topic
    const deleteTopic = e => {
      // get id of topic to delete
      const {id} = e.target;
      setTopics(prevTopics => prevTopics.filter(topic => topic.topicNumber !== Number(id)));
      setTopics(prevTopics => prevTopics.map((topic, index) => ({...topic, topicNumber : index + 1})));
    };
      const handleDeleteTopic = e => {
        confirmExit(
          "Are you sure you want to delete this topic all questions it contains?",
          "Yes, get rid of everything.",
          "No, leave it alone.",
          deleteTopic, 
          e
          );
      };

  // handle addition of new question
    const handleNewQuestion = e => {
      // get id of topic to delete
      const {id} = e.target;
      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(id));
        const newQuestion = {...initQuestion, questionNumber : (modTopic.questions.length + 1)}
        return [
          ...prevTopics.filter(topic => topic.topicNumber !== Number(id)),
          {...modTopic, questions : [...modTopic.questions, newQuestion]}
        ];
      });
    };

  // callback function to delete question
    const deleteQuestion = e => {
      // get id of topic to delete
      const {id} = e.target;
      const [topicId, questionId] = id.split("-");
      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(topicId));
        const filteredQuestions = modTopic.questions.filter(question => question.questionNumber !== Number(questionId));
        return [
          ...prevTopics.filter(topic => topic.topicNumber !== Number(topicId)),
          {...modTopic, questions : filteredQuestions.map((question, index) => ({...question, questionNumber : index + 1}))}
        ];
      });
    };

    const handleDeleteQuestion = e => {
      confirmExit(
        "Are you sure you want to delete this Question? It will be wiped from existence.",
        "Yes, I never want to see it again.",
        "No, leave it alone.",
        deleteQuestion, 
        e
        );
    };

  // handle update of question
    const handleQuestionChange = e => {
      const {id, name, value} = e.target;
      const [topicId, questionId] = id.split("-");

      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(topicId));
        const modQuestion = {...modTopic.questions.find(question => question.questionNumber === Number(questionId)), [name] : value};

        return [
          ...prevTopics.filter(topic => topic.topicNumber !== Number(topicId)),
          {...modTopic, questions : [...modTopic.questions.filter(question => question.questionNumber !== Number(questionId)), modQuestion]}
        ];
      });
    };

  // handle submission of new quiz
    const submitNewQuiz = (e) => {
      e.preventDefault();
      const {quizName, subject} = quizDetails;
      const newQuizData = {quizName, subject, topics : topics};
      if (!quizId) {
        postQuiz(newQuizData, setMessageText);
      } else {
        editQuiz(newQuizData, quizId, setMessageText);
      }
      navToMenu();
    };

  // delete entire question (for existing quizzes only)
    const handleQuizDelete = (e) => {
      e.preventDefault();
      deleteQuiz(quizId, setMessageText);
      navToMenu();
    };

  const handleUserMessage = (e) => {
    timedUserMsg("You can't have more than 5 topics.", setMessageText);
  };

  return (
    <>
    <Header negateMetrics={true}/>
    <NavBar />
    <main>
      <div className="quizContainer">
        <form onSubmit={submitNewQuiz} className="quizEditorForm">
          <input type="button" className="editorBtn btn cautionBtn colorBtn" onClick={handleQuizDelete} value={`<<**Delete Quiz**>>`}/>
          <div className="quizDetailTitle editorTitle">
            <input type="text" className="editorQuizName editorInput" onChange={handleQuizDetailChange} placeholder="Quiz Name" maxLength="22" name="quizName" value={quizDetails.quizName} required/>
            <input type="text" className="editorQuizSubject editorInput" onChange={handleQuizDetailChange} placeholder="Subject" maxLength="22" name="subject" value={quizDetails.subject} required/>
          </div>
          <div className="topicEditorContainerSpacer">
          {
            topics.map((topic, index) => <QuizTopicInput key={index} numTopics={topics.length} topicData={topic} createNewTopic={createNewTopic} handleDeleteTopic={handleDeleteTopic} handleTopicChange={handleTopicChange} handleQuestionChange={handleQuestionChange} handleDeleteQuestion={handleDeleteQuestion} handleNewQuestion={handleNewQuestion}/>)
          }
          </div>
          <div className="btnContainer btnContainerSingle">
            {!(topics.length >= 5) ? 
              <input type="button" className="editorBtnMain btn colorBtn" onClick={createNewTopic} value="Add New topic"/> :
              <input type="button" className="editorBtnMain btn deactivatedBtn" onClick={handleUserMessage} value="Add New topic"/>
            }
            <button className="editorBtnMain btn colorBtn">Create Quiz</button>
          </div>
          <p className="userMessage emphasizedText quizEditorFormMessage">{messageText}</p>
        </form>
      </div>
    </main>
    </>
  );
};
export default QuizEditor;