import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import AuthContext, {
  AuthContextType,
  DataGoogleLoginType,
} from "../context/AuthContext";

import TemplatePage from "./TemplatePage";
import Title from "../components/Title";
import Book from "../components/Book";
import Button from "../components/Button";

import requester from "../utils/requester";

import { ScreenEnum } from "../components/Navbar";

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const { user, handleLogin, handleLoginError } =
    useContext<AuthContextType>(AuthContext);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      const res = await requester.post<DataGoogleLoginType>("/auth/token", {
        code: response.code,
      });

      if (!res.ok || !res.data) {
        console.error("Failed to get tokens");
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

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <TemplatePage screen={ScreenEnum.LoginPage}>
      <Title text="Login Page" />
      <Book />
      <Button onClick={() => login()} text={<><FcGoogle />Login with Google</>} additionalClass="btn-google"/>
    </TemplatePage>
  );
};

export default LoginPage;
