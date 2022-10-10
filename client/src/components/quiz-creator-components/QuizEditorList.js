import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "./../../context/AppContext";
import {UserContext} from "./../../context/UserContext";
import { parseToken } from './../../modules/parseToken';
import {handleQuizSelect} from "./../../modules/handleQuizSelect";
import Header from "./../Header"
import NavBar from './../navbar-components/NavBar';
import ScrollableListItem from '../common-components/ScrollableListItem';
import ScrollableListEntry from '../common-components/ScrollableListEntry';

const QuizEditorList = () => {

  // load and deconstruct context:
  const {credentials} = useContext(UserContext);
    const {userId} = parseToken(credentials.token);
  const {getQuizData, navCallbacks : {navToQuizEditor}} = useContext(AppContext);

  const [quizLibrary, setQuizLibrary] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState();

  // fetch and set state of stats from backend.
  useEffect(() => {
    getQuizData(setQuizLibrary, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const handle and set quiz selection
    const setQuizSelection = e => {
      handleQuizSelect(e, setSelectedQuiz)
    }  
  
  return(
    <>
      <Header negateMetrics={true}/>
      <NavBar />
      <main>
        <div className="welcomeTextContainer">
          <h1>Your Quizzes</h1>
        </div>
        <div className="quizCardDisplayContainer">
          <div className="quizCardDisplaySpacer spacerTextContainer">
            <span className="spacerText">{quizLibrary.length === 0 ? "You haven't authored any quizzes yet - click 'Create New Quiz' to get started" : "Select one of your quizzes below to make changes"}</span>
          </div>
            <div className="scrollableListContainer">
                {quizLibrary.map(quiz => {
                  const {_id, quizName, subject, topicsText} = quiz;
                  const isSelected = selectedQuiz === _id
                  return (
                    <ScrollableListItem reactkey={_id} id={_id} onClick={setQuizSelection} >
                      <ScrollableListEntry label={"Quiz Name: "} value={quizName}/>
                      <ScrollableListEntry label={"Subject: "} value={subject}/>
                      <ScrollableListEntry label={"Topics: "} value={topicsText}/>
                      <ScrollableListEntry label={""} value={isSelected ? <button onClick={e => navToQuizEditor(selectedQuiz)}>Edit</button> : ""}/>
                    </ScrollableListItem>
                  );  
                })}
            </div>
          <div className="quizCardDisplaySpacer"></div>
        </div>
      </main>
    </>
  )
}
export default QuizEditorList;