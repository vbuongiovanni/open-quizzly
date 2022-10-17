const RevealingFilter = props => {
  const {
    subjects,
    filterHeight,
    subjectSelections,
    setSubjectSelections, 
    setFilterHeight
  } = props;

  const revealTime = 1;

  const hideSubjectFilter = () => {
    let height = filterHeight;
    let intervalTimer = setInterval(() => {
      setFilterHeight(prevFilterHeight => prevFilterHeight - 1)
      height -= 1;
      if (height === 0) {
        clearInterval(intervalTimer)
      }
    }, revealTime);
  };

  const revealSubjectFilter = () => {
    let height = filterHeight;
    let intervalTimer = setInterval(() => {
      setFilterHeight(prevFilterHeight => prevFilterHeight + 1)
      height += 1;
      if (height === 125) {
        clearInterval(intervalTimer);
      }
    }, revealTime);
  };

  const toggleSubjectFilter = () => {
    if (filterHeight === 0) {
      revealSubjectFilter()
    } else {
      hideSubjectFilter(125)
    };
  };

  const onSelectChange = e => {
    const selectedValue = e.target.value ? e.target.value : e.target.id;
    setSubjectSelections(prevSelections => {
      return prevSelections.indexOf(selectedValue) === -1 ? [...prevSelections, selectedValue] : prevSelections.filter(selection => selection !== selectedValue)
    });
  };


  return (
    <div className="selectContainer">
      <div className="selectContainerContent" style={{height : `${filterHeight}px`}}>
        <div className="availableTopicContainer">
          <h4>Available Subjects</h4>
          <select
            className="selectInput"
            style={{borderRadius : "5px", border : "1px solid #0099ff"}}
            multiple={true}
            name={"selectedTopics"}
            onChange={onSelectChange}
            value={subjectSelections}>
              {subjects.sort((a, b) => a < b ? -1 : 1).map((selection, index) => <option className={"clickable"} key={index} value={selection}>{selection}</option>)}
          </select>
        </div>
        <div className="selectedTopicContainer">
          <h4>Selected Subjects</h4>
          <div className="selectedTopicContainerContent">
            {subjectSelections.map((selection, index) => <span key={index} id={selection} onClick={onSelectChange} className="selectedTopic">{selection}</span>)}
          </div>
        </div>
      </div>
      <div className='filterBtnContainer'>
        <input type="button" className="btn colorBtn filterBtn" value={filterHeight === 125 ? "Hide Subject Filter" : "Show Subject Filter"} name="isSubjectFilterHidden" onClick={toggleSubjectFilter}/>
      </div>
      </div>
  );
};
export default RevealingFilter;