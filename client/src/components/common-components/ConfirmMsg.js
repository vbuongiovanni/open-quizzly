

const ConfirmMsg = (props) => {
  const {text, confirmText, denyText, onAcceptCallback, setInConfirmPopup} = props.options;

  const windowMain = {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(22, 31, 34, .5)",
  }

  const handleAccept = () => {
    onAcceptCallback();
    setInConfirmPopup(false);
  }

  const handleDeny = () => {
    setInConfirmPopup(false);
  }

  return (
    <div style={windowMain}>
      <div className="msgBoxContainer">
        <h3 className="msgBoxText">{text}</h3>
        <div className="msgBoxOptionsContainer">
          <div className="colorBtn btn msgBoxOptions cautionBtn" onClick={handleAccept}>{confirmText}</div>
          <div className="colorBtn btn msgBoxOptions msgBoxDeny" onClick={handleDeny}>{denyText}</div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmMsg;