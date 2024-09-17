import React, { useContext } from "react";
import AuthContext, { AuthContextType, DataGoogleLoginType } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import requester from "../utils/requester";
import TemplatePage from "./TemplatePage";
import { ScreenEnum } from "../components/Navbar";
import Title from "../components/Title";

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const { user, handleLogin, handleLoginError } = useContext<AuthContextType>(AuthContext);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      const res = await requester.post<DataGoogleLoginType>('/auth/token', {
        code: response.code,
      });

      if(!res.ok || !res.data) {
        console.error('Failed to get tokens')
        return;
      }
      const data = res.data
      handleLogin(data.data.accessToken, data.data.refreshToken, data.data.user)
    },
    onError: handleLoginError,
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return <TemplatePage screen={ScreenEnum.LoginPage}>
            <Title text="Login Page" />
            <button onClick={() => login()}>Login with Google</button>
          </TemplatePage>
};

export default LoginPage;
