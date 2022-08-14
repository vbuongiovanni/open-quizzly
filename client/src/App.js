import React, {useEffect, useState} from 'react';
import Navbar from './components/Navbar';
import MainMenu from './components/MainMenu';
import { AppContextProvider } from './components/AppContext';
import './styles.css';

import QuizDetailPage from './components/quiz-components/QuizDetailPage';

function App() {

  const [selectedQuiz, setPage] = useState();

    // returns html ID of card, which is the corresponding '_id' of the quiz.
    const handleClick = (e) => {
      setPage(e.target.id)
    }
    const handleBack = (e) => {
      setPage(undefined) 
    }

  return (
    <AppContextProvider>
      <main className="App">
        <Navbar />
        {!selectedQuiz ? <MainMenu handleClick={handleClick}/> : <QuizDetailPage  handleBack={handleBack} selectedQuiz={selectedQuiz}/>}
      </main>
    </AppContextProvider>
  );
}

export default App;
