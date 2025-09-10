import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../../../components/button/CustomButton";
import CustomInput from "../../../components/input/CustomInput";
import Spacer from "../../../components/spacer/Spacer";
import { handleError } from "../../../helpers/error/ErrorHelper";
import { checkAvailability, register } from "../../../services/UserServices";
import "./RegisterStyles.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      handleError(err);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    setCheckingEmail(true);
    const result = await checkAvailability(formData.email);
    setCheckingEmail(false);
    if (result.error) setEmailError(result.error);
  };

  const handleUsernameBlur = async () => {
    if (!formData.username) return;
    setCheckingUsername(true);
    const result = await checkAvailability(formData.username);
    setCheckingUsername(false);
    if (result.error) setUsernameError(result.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.username &&
      formData.firstname &&
      formData.lastname &&
      formData.email &&
      formData.password
    );
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <CustomInput
          name="username"
          placeholder="Kullanıcı Adı"
          onBlur={handleUsernameBlur}
          value={formData.username}
          onChange={handleChange}
          hasError={usernameError}
          fontColor="black"
        />
        <Spacer />
        <div className="name-container">
          <CustomInput
            name="firstname"
            placeholder="İsim"
            value={formData.firstname}
            onChange={handleChange}
            fontColor="black"
          />
          <Spacer />
          <CustomInput
            name="lastname"
            placeholder="Soyisim"
            value={formData.lastname}
            onChange={handleChange}
            fontColor="black"
          />
        </div>
        <Spacer />
        <CustomInput
          name="email"
          placeholder="Email"
          onBlur={handleEmailBlur}
          value={formData.email}
          onChange={handleChange}
          hasError={emailError}
          fontColor="black"
        />
        <Spacer />
        <CustomInput
          name="password"
          placeholder="Şifre"
          type="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          fontColor="black"
        />
        <Spacer size={20} />
        <CustomButton
          text="Kayıt Ol"
          disabled={!isFormValid() || checkingEmail || checkingUsername}
          onClick={handleRegister}
        />
        <Spacer size={25} />
        <p className="form-footer">
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
