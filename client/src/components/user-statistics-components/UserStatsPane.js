const UserStatsPane = props => {
  const {globalStats, tabSelection} = props;

  const getTabsetData = () => {
    const selectedKey = Object.keys(globalStats).filter(key => key.includes(tabSelection));
    const renderData = globalStats[selectedKey].map(result => {
      let output = "";
      switch(tabSelection) {
        case "Subjects" : 
          output = {
            header : result.subject,
            ratioCorrect : `${result.totalCorrect}/${result.totalAttempted}`,
            pctCorrect : result.totalCorrect/result.totalAttempted
          }
          break;
        case "Quizzes" : 
          output = {
            header : result.quizName,
            ratioCorrect : `${result.totalCorrect}/${result.totalAttempted}`,
            pctCorrect : result.totalCorrect/result.totalAttempted
          }
          break;
        case "Topics" : 
          output = {
            header : `${result.topic} (${result.subject})`,
            ratioCorrect : `${result.totalCorrect}/${result.totalAttempted}`,
            pctCorrect : result.totalCorrect/result.totalAttempted
          }
          break;
        default :
          output = "";
      }
      return output;
    });
    return renderData.sort((a, b) => a.pctCorrect >= b.pctCorrect ? -1 : 1);
  }

  const renderContent = getTabsetData();

  return (
    <div className="userStatsPane">
      {renderContent.map((result, index) => {
        return (
          <div key={index} className="userStatsResultsCard">
            <p className="userStatsResultsCardTitle">{result.header}</p>
            <p className="userStatsResultsCardStats">
              <span className="userStatsResultsCardRatio">{result.ratioCorrect}</span> 
              <span className="userStatsResultsCardSep"> - </span> 
              <span className="userStatsResultsCardPct emphasizedText">{`${(Math.round(result.pctCorrect*10000)/100)}%`}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
export default UserStatsPane;