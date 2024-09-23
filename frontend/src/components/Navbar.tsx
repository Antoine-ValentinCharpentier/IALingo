import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

import AuthContext, { AuthContextType } from "../context/AuthContext";

import Button from "./Button";

import "../styles/components/Navbar.css"

export enum ScreenEnum {
    HomePage,
    LoginPage,
    VocabularyPage,
    TextPage
}

type NavbarProps = {
    isOpen: boolean;
    screen: ScreenEnum;
};

const Navbar: React.FC<NavbarProps> = ({isOpen, screen}) => {
    const navigate = useNavigate();
    const { handleLogout } = useContext<AuthContextType>(AuthContext);

    return <>
        <div className={isOpen ? "navbar-container navbar-open" : "navbar-container"}>
            <div className="navbar-list">
                <div 
                    className={screen === ScreenEnum.HomePage ? "navbar-item navbar-item-active" : "navbar-item navbar-item-active"}
                    onClick={() => {
                        if(screen !== ScreenEnum.HomePage) {
                            navigate('/')
                        }
                    }}
                >
                    {screen === ScreenEnum.HomePage && (<IoIosArrowForward />)}
                    <p>Home</p>
                </div>
                <div 
                    className={screen === ScreenEnum.VocabularyPage ? "navbar-item navbar-item-active" : "navbar-item navbar-item-active"}
                    onClick={() => {
                        if(screen !== ScreenEnum.VocabularyPage) {
                            navigate('/vocabulary')
                        }
                    }}
                >
                    {screen === ScreenEnum.VocabularyPage && (<IoIosArrowForward />)}
                    <p>Vocabulary</p>
                </div>
                <div 
                    className={screen === ScreenEnum.TextPage ? "navbar-item navbar-item-active" : "navbar-item navbar-item-active"}
                    onClick={() => {
                        if(screen !== ScreenEnum.TextPage) {
                            navigate('/text')
                        }
                    }}
                >
                    {screen === ScreenEnum.TextPage && (<IoIosArrowForward />)}
                    <p>Reading comprehension</p>
                </div>
            </div>
            <div className="navbar-footer">
                <Button text="Logout" onClick={handleLogout}/>
            </div>
        </div>
    </>
}


export default Navbar;


