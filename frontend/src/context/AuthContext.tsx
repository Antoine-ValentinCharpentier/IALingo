import React, { createContext, ReactNode } from "react";
import { googleLogout, CredentialResponse } from "@react-oauth/google";
import useLocalStorage from "../hooks/useLocalStorage";

export interface AuthContextType {
  jwt: string | undefined;
  handleLogout: () => void;
  handleLogin: (response: CredentialResponse) => void;
  handleLoginError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
const defaultValues: AuthContextType = {
  jwt: undefined,
  handleLogout: () => {},
  handleLogin: () => {},
  handleLoginError: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValues);

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [jwt, setJwt] = useLocalStorage("token", defaultValues.jwt);

  function handleLogout() {
    googleLogout();
    setJwt(undefined);
  }

  function handleLogin(response: CredentialResponse) {
    setJwt(response.credential);
  }

  function handleLoginError() {
    console.log("Échec de la connexion.");
    setJwt(undefined);
  }

  const values = {
    jwt,
    handleLogout,
    handleLogin,
    handleLoginError,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
