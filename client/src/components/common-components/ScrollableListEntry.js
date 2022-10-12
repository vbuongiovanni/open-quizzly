const ScrollableListEntry = props => {
  const {label, value, labelClassName, valueClassName, reactKey} = props;
  const labelClassNameFull = `histQuizListItem__label ${labelClassName ? labelClassName : ""}`
  const valueClassNameFull = `${valueClassName ? valueClassName : ""}`
  return (
    <p key={reactKey} className="histQuizListItem__pair histQuizListItem__text">
      {label && <span className={labelClassNameFull}>{label}</span>}
      <span className={valueClassNameFull} >{value}</span>
    </p>
  );
};
export default ScrollableListEntry;