export default function QuizCard(props) {
  const handleClick = props.handleClick;
  const {_id, quizName, subject, topics} = props.cardDetails;
  const topicsText = topics.map(topic => topic.topicName).join(", ");

  return (
    <div className="quizCard" id={_id} onClick={handleClick}>
      <div className="quizCardContent">
        <h4 className="quizCardName">{quizName}</h4>
        <h4 className="quizCardSubject">{subject}</h4>
        <p>{topicsText}</p>
      </div>
    </div>
  )
}