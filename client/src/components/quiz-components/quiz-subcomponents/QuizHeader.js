const QuizHeader = (props) => {
  return (
    <div className='quizDetailTitle'>
      <p className="quizHeaderMain">{props.quizName}</p>
      <p className="quizSubHeader">Subject: {props.subject}</p>
    </div>
  );
};
export default QuizHeader;