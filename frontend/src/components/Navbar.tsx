import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

import AuthContext, { AuthContextType } from "../context/AuthContext";
import Button from "./Button";

import "../styles/components/Navbar.css";

export enum ScreenEnum {
  HomePage,
  LoginPage,
  VocabularyPage,
  TextPage,
}

type NavbarProps = {
  isOpen: boolean;
  screen: ScreenEnum;
};

const Navbar: React.FC<NavbarProps> = ({ isOpen, screen }) => {
  const navigate = useNavigate();
  const { handleLogout } = useContext<AuthContextType>(AuthContext);

  const navItems = [
    { label: "Home", screen: ScreenEnum.HomePage, path: "/" },
    {
      label: "Vocabulary",
      screen: ScreenEnum.VocabularyPage,
      path: "/vocabulary",
    },
    {
      label: "Reading comprehension",
      screen: ScreenEnum.TextPage,
      path: "/reading",
    },
  ];

  const getNavItemClassName = (navScreen: ScreenEnum) => {
    return screen === navScreen
      ? "navbar-item navbar-item-active"
      : "navbar-item";
  };

  return (
    <div
      className={isOpen ? "navbar-container navbar-open" : "navbar-container"}
    >
      <div className="navbar-list">
        {navItems.map((item) => (
          <div
            key={item.screen}
            className={getNavItemClassName(item.screen)}
            onClick={() => {
              if (screen !== item.screen) {
                navigate(item.path);
              }
            }}
          >
            {screen === item.screen && <IoIosArrowForward />}
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <div className="navbar-footer">
        <Button text="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Navbar;