import React from "react";

import PrivatePage from "./layout/PrivatePage";
import PublicPage from "./layout/PublicPage";

import { useRoutes } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext'; 

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import VocabularyPage from "./pages/VocabularyPage";
import ReadingPage from "./pages/ReadingPage";
import RegisterPage from "./pages/RegisterPage";

import './assets/styles/GlobalStyle.css'

function App(): JSX.Element {
  const routes = useRoutes([
    {
      path: '/register',
      element: <PublicPage element={<RegisterPage />} />,
    },
    {
      path: '/login',
      element: <PublicPage element={<LoginPage />} />,
    },
    {
      path: '/vocabulary',
      element: <PrivatePage element={<VocabularyPage />} />,
    },
    {
      path: '/reading',
      element: <PrivatePage element={<ReadingPage />} />,
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
