import {useState} from "react";
import Header from "./Header";
import NavBar from './NavBar';
import QuizTopicInput from "./quiz-creator-components/QuizTopicInput";
import {confirm} from "react-confirm-box";
import axios from "axios";

const QuizCreator = () => {

  // initialize question and topic objects
    const initQuestion = {
      questionText : "",
      correctAnswer : "",
      incorrectAnswer1 : "",
      incorrectAnswer2 : "",
      incorrectAnswer3 : "",
      questionNumber : 1
    }

    const initTopic = {
      topicName : "",
      topicNumber : 1,
      questions : [{...initQuestion}]
    }

    // initialize state
      const [quizDetails, setQuizDetails] = useState({quizName : "", subject : ""});
      const [topics, setTopics] = useState([{...initTopic}]);
      const [messageText, setMessageText] = useState("")

  // handle quiz detail inputs
    const handleQuizDetailChange = e => {
      const {name, value} = e.target;
      setQuizDetails(prevDetails => ({...prevDetails, [name] : value}));
    } 

  // 
  // functions to 1) handle the click of sub-button on form and 
  // 2) uses a confirmation box to dictate whether or not to exit
  const confirmExit = async (userQuestion, confirmText, cancelText, deleteHander, event) => {
    const options = {
      labels: {
        confirmable: confirmText,
        cancellable: cancelText
      }
    }
    const userRes = await confirm(userQuestion, options);
    if (userRes) {
      deleteHander(event)
    }
  }

  // handle new topic
    const createNewTopic = e => {
      setTopics(prevTopics => {
        const nextTopicNum = prevTopics.length + 1;
        return [...prevTopics, {...initTopic, topicNumber : nextTopicNum}];
      })
    }

  // handle topic name change
    const handleTopicChange = e => {
      // get id of topic to delete
      const {id, name, value} = e.target
      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(id));
        return [...prevTopics.filter(topic => topic.topicNumber !== Number(id)), {...modTopic, [name] : value}];
      })
    }

  // handle deletion of topic
    const deleteTopic = e => {
      // get id of topic to delete
      const {id} = e.target
      setTopics(prevTopics => prevTopics.filter(topic => topic.topicNumber !== Number(id)))
      setTopics(prevTopics => prevTopics.map((topic, index) => ({...topic, topicNumber : index + 1})))
    }
    
      const handleDeleteTopic = e => {
        confirmExit(
          "Are you sure you want to delete this topic all questions it contains?",
          "Yes, get rid of everything.",
          "No, leave it alone.",
          deleteTopic, 
          e
          )
      }
 
    
  // handle addition of new question
    const handleNewQuestion = e => {
      // get id of topic to delete
      const {id, name, value} = e.target
      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(id));
        const newQuestion = {...initQuestion, questionNumber : (modTopic.questions.length + 1)}
        return [
          ...prevTopics.filter(topic => topic.topicNumber !== Number(id)),
          {...modTopic, questions : [...modTopic.questions, newQuestion]}
        ];
      })
    }

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
      })
    }

      const handleDeleteQuestion = e => {
        confirmExit(
          "Are you sure you want to delete this Question? It will be wiped from existence.",
          "Yes, I never want to see it again.",
          "No, leave it alone.",
          deleteQuestion, 
          e
          )
      }

  // handle update of question
    const handleQuestionChange = e => {
      const {id, name, value} = e.target;
      const [topicId, questionId] = id.split("-");

      setTopics(prevTopics => {
        const modTopic = prevTopics.find(topic => topic.topicNumber === Number(topicId));
        const modQuestion = {...modTopic.questions.find(question => question.questionNumber === Number(questionId)), [name] : value}
        console.log(modQuestion)

        return [
          ...prevTopics.filter(topic => topic.topicNumber !== Number(topicId)),
          {...modTopic, questions : [...modTopic.questions.filter(question => question.questionNumber !== Number(questionId)), modQuestion]}
        ];
      })
    }

  // handle submission of new quiz
    const submitNewQuiz = (e) => {
      e.preventDefault();
      const {quizName, subject} = quizDetails;
      const requestBody = {quizName, subject, topics : topics};

      axios.post(`/quiz/add`, requestBody)
          .then(res => console.log(res.data))
          .catch(err => setMessageText(err.response.data.errMsg))
    
    }

  return (
    <main>
      <Header negateMetrics={true}/>
      <NavBar />
      <div className="quizContainer">
        <form onSubmit={submitNewQuiz} className="quizCreatorForm">
          <div className="quizDetailTitle creatorTitle">
            <input type="text" className="creatorQuizName creatorInput" onChange={handleQuizDetailChange} placeholder="Quiz Name" name="quizName" value={quizDetails.quizName} required/>
            <input type="text" className="creatorQuizSubject creatorInput" onChange={handleQuizDetailChange} placeholder="Subject" name="subject" value={quizDetails.subject} required/>
          </div>
          <div className="topicCreatorContainerSpacer">
          {
            topics.map((topic, index) => <QuizTopicInput key={index} topicData={topic} createNewTopic={createNewTopic} handleDeleteTopic={handleDeleteTopic} handleTopicChange={handleTopicChange} handleQuestionChange={handleQuestionChange} handleDeleteQuestion={handleDeleteQuestion} handleNewQuestion={handleNewQuestion}/>)
          }
          </div>
          <div className="btnContainer btnContainerSingle">
            <input type="button" className="creatorBtn creatorBtnMain colorBtn" onClick={createNewTopic} value="Add another topic"/>
            <button className="creatorBtn creatorBtnMain colorBtn">Create Quiz</button>
          </div>
          <p className="userMessage quizCreatorFormMessage">{messageText}</p>
        </form>
      </div>
    </main>
  )
}
export default QuizCreator