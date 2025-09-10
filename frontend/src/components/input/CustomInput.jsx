import { PiEyeClosedLight, PiEyeFill } from "react-icons/pi";
import "./InputStyles.css";

const CustomInput = ({
  placeholder = "",
  value,
  onChange,
  onBlur,
  multiline = false,
  rows = 4,
  icon: Icon = null,
  iconSize = 24,
  iconColor = "black",
  type = "text",
  showPassword = false,
  toggleShowPassword = () => {},
  name,
  hasError = false,
  multiple = false, // file input için
  fontColor = "white",
}) => {
  return (
    <div className={`input-container ${hasError ? "input-error" : ""}`}>
      {Icon && (
        <Icon
          size={iconSize}
          color={hasError ? "red" : iconColor}
          className="input-icon"
        />
      )}

      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          className={`input ${hasError ? "input-error" : ""}`}
          style={{ color: fontColor }}
        />
      ) : (
        <input
            name={name}
          style={{ color: fontColor }}
          placeholder={placeholder}
          value={type !== "file" ? value : undefined} // file input controlled olmamalı
          onChange={onChange}
          onBlur={onBlur}
          className={`input ${hasError ? "input-error" : ""}`}
          type={type === "password" && showPassword ? "text" : type}
          multiple={type === "file" ? multiple : undefined}
        />
      )}

      {type === "password" && (
        <span className="password-toggle" onClick={toggleShowPassword}>
          {showPassword ? (
            <PiEyeFill size={24} color={hasError ? "red" : "black"} />
          ) : (
            <PiEyeClosedLight size={24} color={hasError ? "red" : "black"} />
          )}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
