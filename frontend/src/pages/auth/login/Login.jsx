import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../../../components/button/CustomButton";
import CustomInput from "../../../components/input/CustomInput";
import Spacer from "../../../components/spacer/Spacer";
import AuthContext from "../../../context/auth/AuthContext";
import { handleError } from "../../../helpers/error/ErrorHelper";
import "./LoginStyles.css";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const res = await login(identifier, password);

      if (res.success) {
        // rol bilgisi nerede geliyor?
        const role = res.data?.role || res.data?.user?.role;

        if (role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const isFormValid = () => {
    return identifier && password;
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <CustomInput
          placeholder="Kullanıcı Adı veya Email"
          name="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          fontColor="black"
        />
        <Spacer />
        <CustomInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          name="password"
          showPassword={showPassword}
          type="password"
          toggleShowPassword={toggleShowPassword}
          fontColor="black"
        />
        <Spacer size={20} />
        <CustomButton
          text="Giriş Yap"
          onClick={handleLogin}
          disabled={!isFormValid()}
        />
        <Spacer size={25} />
        <p className="form-footer">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
