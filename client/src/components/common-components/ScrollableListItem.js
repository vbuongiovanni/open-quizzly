const ScrollableListItem = props => {
  const {reactKey, id, onClick} = props;
  return (
    <div key={reactKey} id={id} onClick={onClick} className="histQuizListItem btn">
      {props.children}
    </div>
  );
};
export default ScrollableListItem;