export default (props) => {
  return(
    <header>
      <div className="logoContainer">
        <img className="logoHeaderBear" src={require("../resources/quizzly-bear.png")}/>
        <h1 className="logoHeaderText">Quizzly.</h1>
      </div>
      {!props.negateMetrics && 
        <div className="headerMetrics">
          <h3>Correct Answers: {props.globalStats.globalCorrectTotal}</h3>
          <h3>Total Answers: {props.globalStats.globalTotal}</h3>
        </div>
      }
    </header>
  )
}