const UserStatsTabset = props => {
  const {tabSelection, changeTabset, selections} = props.tabsetProps;
  return (
    <nav className="tabsetContainer">
      {selections.map((tab, index) => <div key={index} id={tab} onClick={changeTabset} className={`tabsetBtn${tabSelection === tab ? " activeTabsetBtn" : ""}`}><span className="userStatsTabset">{tab}</span></div>)}
    </nav>
  );
};
export default UserStatsTabset;