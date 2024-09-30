import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import AuthContext, {
  AuthContextType,
  DataGoogleLoginType,
  UserType,
} from "../context/AuthContext";

import TemplatePage from "../layout/TemplatePage";
import Title from "../components/ui/Title";
import Book from "../components/ui/Book";
import Button from "../components/form/Button";

import requester from "../utils/requester";

import { ScreenEnum } from "../components/ui/Navbar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginLocalResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: UserType;
  };
}

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { user, handleLogin, handleLoginError } =
    useContext<AuthContextType>(AuthContext);

  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      const res = await requester.post<DataGoogleLoginType>(
        "/auth/google/login",
        {
          code: response.code,
        }
      );

      if (!res.ok || !res.data) {
        toast.error("Please log in using your password.");
        return;
      }
      const data = res.data;
      handleLogin(
        data.data.accessToken,
        data.data.refreshToken,
        data.data.user
      );
    },
    onError: handleLoginError,
  });

  const localLogin = async () => {
    if (!emailRegex.test(email) || !email.trim() || !password.trim()) {
      toast.error("Please enter a valid email and password !");
      return;
    }
    const response = await requester.post<LoginLocalResponse>(
      "/auth/local/login",
      {
        email,
        password,
      }
    );
    if (!response.ok || !response.data) {
      toast.error("Invalid email or password !");
      return;
    }
    handleLogin(
      response.data.data.accessToken,
      response.data.data.refreshToken,
      response.data.data.user
    );
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <TemplatePage screen={ScreenEnum.LoginPage}>
      <Title text="Login Page" />
      <Book />
      <Button
        onClick={() => googleLogin()}
        text={
          <>
            <FcGoogle />
            Login with Google
          </>
        }
        additionalClass="btn-google"
      />

      <div>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={localLogin}>Login</button>

      <p onClick={() => navigate("/register")}>
        You don't have an account ? Click here to go to the register page
      </p>
    </TemplatePage>
  );
};

export default LoginPage;
