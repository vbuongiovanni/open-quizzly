const ScrollableListEntry = props => {
  const {label, value, labelClassName, valueClassName} = props;
  const labelClassNameFull = `histQuizListItem__label ${labelClassName ? labelClassName : ""}`
  const valueClassNameFull = `${valueClassName ? valueClassName : ""}`
  return (
    <p className="histQuizListItem__pair histQuizListItem__text">
      {label && <span className={labelClassNameFull}>{label}</span>}
      <span className={valueClassNameFull} >{value}</span>
    </p>
  );
};
export default ScrollableListEntry;