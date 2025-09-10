import "./ButtonStyles.css";

const CustomButton = ({ text, onClick, disabled }) => {
  return (
    <button onClick={onClick} className="btn-31" disabled={disabled}>
      <span className="text-container">
        <span className="text">{text}</span>
      </span>
    </button>
  );
};

export default CustomButton;
