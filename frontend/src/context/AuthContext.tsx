import React, { createContext, ReactNode, useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import useLocalStorage from "../hooks/useLocalStorage";

export interface AuthContextType {
  user: UserType |undefined;
  accessToken: string;
  refreshToken: string;
  handleLogout: () => void;
  handleLogin: (accessToken:string, refreshToken:string, user: UserType) => void;
  handleLoginError: () => void;
}

export interface UserType {
  email: string;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}
interface AuthProviderProps {
  children: ReactNode;
}
const defaultValues: AuthContextType = {
  user: undefined,
  accessToken: "",
  refreshToken: "",
  handleLogout: () => {},
  handleLogin: () => {},
  handleLoginError: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValues);

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState(defaultValues.user)
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", defaultValues.accessToken);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", defaultValues.refreshToken);

  function handleLogout() {
    googleLogout();
    setUser(undefined)
    setAccessToken("");
    setRefreshToken("")
  }

  function handleLogin(accessToken:string, refreshToken:string, user: UserType) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user)
  }

  function handleLoginError() {
    console.log("Échec de la connexion.");
    setAccessToken("");
    setRefreshToken("");
  }

  useEffect(() => {
    async function autoLogin() {
      const refreshToken = localStorage.getItem('IALingo-refreshToken');
      if(refreshToken && refreshToken !== ""){
        const response = await fetch(`http://localhost:8000/auth/token/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: refreshToken,
          }),
        });

        if (!response.ok) {
          setUser(undefined);
          setAccessToken("");
          setRefreshToken("");
          return;
        }
  
        const data = await response.json();
        setUser(data.data.user)
        setAccessToken(data.data.accessToken)
        setRefreshToken(data.data.refreshToken)
      }
    }
    autoLogin();
  }, [setAccessToken, setRefreshToken])

  const values = {
    user,
    accessToken,
    refreshToken,
    handleLogout,
    handleLogin,
    handleLoginError,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
