import React, { useContext } from "react";

import { RxHamburgerMenu } from "react-icons/rx";

import AuthContext from "../../context/AuthContext";

import "../../assets/styles/components/ui/Header.css"

type HeaderProps = {
    setIsNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({setIsNavbarOpen}) => {

    const { user } = useContext(AuthContext);

    return <div className="header">
        {user && (<div className="header-navbar">
            <RxHamburgerMenu onClick={() => setIsNavbarOpen(prev => !prev)}/>
        </div>)}
        <div className="header-title">
            <p><span>IA</span>Lingo</p>
        </div>
    </div>
}


export default Header;


