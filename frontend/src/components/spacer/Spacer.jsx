const Spacer = ({ horizontal = false, size = 10 }) => {
  return (
    <div
      style={{
        width: horizontal ? `${size}px` : "",
        height: !horizontal ? `${size}px` : "",
      }}
    ></div>
  );
};

export default Spacer;
