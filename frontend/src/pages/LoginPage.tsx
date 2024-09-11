import React, { useContext } from "react";
import AuthContext, { AuthContextType } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const { jwt, handleLogin, handleLoginError } = useContext<AuthContextType>(AuthContext);

  if (jwt) {
    return <Navigate to="/" />;
  }

  return <>
    LoginPage
    <GoogleLogin
        onSuccess={handleLogin}
        onError={handleLoginError}
        shape='pill'
    />
  </>;
};

export default LoginPage;
