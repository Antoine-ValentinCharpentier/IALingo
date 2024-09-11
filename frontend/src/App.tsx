import React from "react";
import PrivatePage from "./pages/PrivatePage";
import PublicPage from "./pages/PublicPage";
import { useRoutes } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext'; 
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App(): JSX.Element {
  const routes = useRoutes([
    {
      path: '/login',
      element: <PublicPage element={<LoginPage />} />,
    },
    { 
      path: '*', 
      element: <PrivatePage element={<HomePage />} /> 
    },
  ]);

  return (
    <AuthContextProvider>
      {routes}
    </AuthContextProvider>
  );
}

export default App;
