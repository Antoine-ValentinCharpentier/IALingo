import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AuthContext, { AuthContextType } from "../context/AuthContext";

import TemplatePage from "./TemplatePage";
import Title from "../components/Title";
import Book from "../components/Book";

import requester from "../utils/requester";

import { ScreenEnum } from "../components/Navbar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
interface UserRegister {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

type RegisterPageProps = {};

const RegisterPage: React.FC<RegisterPageProps> = (): JSX.Element => {
  const [userData, setUserData] = useState<UserRegister>({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { user } = useContext<AuthContextType>(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = async () => {
    if (
      !userData.username.trim() ||
      !userData.email.trim() ||
      !userData.password.trim() ||
      !emailRegex.test(userData.email.trim()) 
    ) {
      toast.error("Please enter a valid username, email and password !");
      return;
    }
    const response = await requester.post<RegisterResponse>(
      "/auth/local/register",
      userData
    );
    if (!response.ok) {
      toast.error("An account associated with this email already exists.");
      return;
    }
    toast.success("The account was successfully created");
    navigate("/login");
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <TemplatePage screen={ScreenEnum.LoginPage}>
      <Title text="Register Page" />
      <Book />

      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button onClick={handleRegister}>Register</button>

      <p onClick={() => navigate("/login")}>
        You have already an account ? Click here to go to the login page
      </p>
    </TemplatePage>
  );
};

export default RegisterPage;
