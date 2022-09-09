const UserStatsTabset = props => {
  const {tabSelection, changeTabset, selections} = props.tabsetProps;
  return (
    <nav className="tabsetContainer">
      {selections.map(tab => <div id={tab} onClick={changeTabset} className={`tabsetBtn${tabSelection === tab ? " activeTabsetBtn" : ""}`}>{tab}</div>)}
    </nav>
  )
}
export default UserStatsTabset;