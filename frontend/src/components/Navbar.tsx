import React, { useContext } from "react";
import { IoIosArrowForward } from "react-icons/io";

import AuthContext, { AuthContextType } from "../context/AuthContext";

import "../styles/components/Navbar.css"
import Button from "./Button";

export enum ScreenEnum {
    HomePage,
    LoginPage
}

type NavbarProps = {
    isOpen: boolean;
    screen: ScreenEnum;
};

const Navbar: React.FC<NavbarProps> = ({isOpen, screen}) => {
    
    const { handleLogout } = useContext<AuthContextType>(AuthContext);

    return <>
        <div className={isOpen ? "navbar-container navbar-open" : "navbar-container"}>
            <div className="navbar-list">
                <div className={screen === ScreenEnum.HomePage ? "navbar-item navbar-item-active" : "navbar-item navbar-item-active"}>
                    {screen === ScreenEnum.HomePage && (<IoIosArrowForward />)}
                    <p>Home</p>
                </div>
            </div>
            <div className="navbar-footer">
                <Button text="Logout" onClick={handleLogout}/>
            </div>
        </div>
    </>
}


export default Navbar;


