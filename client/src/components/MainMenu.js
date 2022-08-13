import React, {useEffect, useState} from 'react';
import axios from "axios";
import QuizCard from "./QuizCard";

function  MainMenu(props)  {

  const [quizData, setQuizData] = useState([]);
  const userName = "John Smith";

  useEffect(() => {
    const getQuizData = async () => {
      const res = await axios.get("quiz/")
        .catch(err => console.log(err))
      if (res !== undefined) {
        const data = await res.data;
        setQuizData(data);
      }
    }
    getQuizData();
  }, [])

  return(
    <main>
      <div  className="quizDataDisplay">
        <h2>Welcome, {userName}!</h2>
      </div>
      <div className="quizCardDisplay">
          {quizData.map(quizDetails => <QuizCard 
                                          key={quizDetails._id}
                                          handleClick={props.handleClick}
                                          cardDetails={quizDetails}/>
                                      )}
      </div>
    </main>
  )
}

export default MainMenu