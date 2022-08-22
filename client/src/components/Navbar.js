export default (props) => {
  return(
    <nav>
      <img src={require("../resources/quizzly-bear.png")}/>
      <h1>Quizzly</h1>
      <h3>Correct Answers: {props.globalStats.globalCorrectTotal}</h3>
      <h3>Total Answers: {props.globalStats.globalTotal}</h3>
    </nav>
  )
}