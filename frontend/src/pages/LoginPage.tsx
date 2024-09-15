import React, { useContext } from "react";
import AuthContext, { AuthContextType, DataGoogleLoginType } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import requester from "../utils/requester";

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const { user, handleLogin, handleLoginError } = useContext<AuthContextType>(AuthContext);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      console.log("Authorization Code:", response);

      const res = await requester.post<DataGoogleLoginType>('/auth/token', {
        code: response.code,
      });

      if(!res.ok || !res.data) {
        console.log('Failed to get tokens')
        return;
      }
      const data = res.data
      console.log("axios", data)
      handleLogin(data.data.accessToken, data.data.refreshToken, data.data.user)
    },
    onError: handleLoginError,
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return <button onClick={() => login()}>Login with Google</button>;
};

export default LoginPage;
