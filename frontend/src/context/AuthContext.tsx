import React, { createContext, ReactNode, useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import useLocalStorage from "../hooks/useLocalStorage";
import requester from "../utils/requester";

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

interface TokensType {
  accessToken: string;
  refreshToken: string;
  user: UserType;
}
export type DataGoogleLoginType = {
  msg: string;
  data: TokensType 
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

  async function handleLogout() {
    await requester.post<DataGoogleLoginType>(`/auth/logout`, {});
    googleLogout();
    setUser(undefined)
    setAccessToken("");
    setRefreshToken("")
    requester.updateTokens("", "")
  }

  function handleLogin(accessToken:string, refreshToken:string, user: UserType) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    requester.updateTokens(accessToken, refreshToken)
    setUser(user)
  }

  function handleLoginError() {
    console.error("Échec de la connexion.");
    setAccessToken("");
    setRefreshToken("");
    requester.updateTokens("", "")
  }

  useEffect(() => {
    async function autoLogin() {
      const refreshToken = localStorage.getItem('IALingo-refreshToken');
      if(refreshToken && refreshToken !== ""){
        const response = await requester.post<DataGoogleLoginType>(`/auth/token/refresh`, {
          token: refreshToken,
        });

        if (!response.ok || !response.data) {
          setUser(undefined);
          setAccessToken("");
          setRefreshToken("");
          requester.updateTokens("", "")
          return;
        }
  
        setUser(response.data.data.user)
        setAccessToken(response.data.data.accessToken)
        setRefreshToken(response.data.data.refreshToken)
        requester.updateTokens(response.data.data.accessToken, response.data.data.refreshToken)
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
