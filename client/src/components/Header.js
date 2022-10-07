const Header = (props) => {
  return(
    <header>
      <div className="logoContainer">
        <img className="logoHeaderBear" src={require("../resources/quizzly-bear.png")} alt={"Presentational icon of a cartoon bear wearing a graduation cap"}/>
        <h1 className="logoHeaderText">Quizzly</h1>
      </div>
      {!props.negateMetrics && 
        <div className="headerMetrics">
          <h3>Correct Answers: {props.globalStats.totalCorrect}</h3>
          <h3>Total Answers: {props.globalStats.totalAnswers}</h3>
        </div>
      }
    </header>
  )
}
export default Header;