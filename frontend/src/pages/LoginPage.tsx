import React, { useContext } from "react";
import AuthContext, { AuthContextType } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = (): JSX.Element => {
  const { user, handleLogin, handleLoginError } = useContext<AuthContextType>(AuthContext);

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      console.log("Authorization Code:", response);

      const result = await fetch(`http://localhost:8000/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: response.code,
        }),
      });

      const data = await result.json();
      console.log(data)
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
