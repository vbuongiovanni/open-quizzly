export default (props) => {

  return (
    <div className='quizDetailTitle'>
          <h2>{props.quizName}</h2>
          <h4>Subject: {props.subject}</h4>
    </div>
  );
}