import React, { ReactNode, useContext, useState } from "react";
import Header from "../components/ui/Header";
import Navbar, { ScreenEnum } from "../components/ui/Navbar";

import AuthContext from "../context/AuthContext";

import '../assets/styles/layout/TemplatePage.css'

type TemplatePageProps = {
    children: ReactNode;
    screen : ScreenEnum;
};

const TemplatePage: React.FC<TemplatePageProps> = ({children, screen}) => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false)
    
    const { user } = useContext(AuthContext);

    return <>
        <Header setIsNavbarOpen={setIsNavbarOpen} />
        <div className="main-container">
            {user && (<Navbar isOpen={isNavbarOpen} screen={screen}/>)}
            <div className="main-content">
                {children}
            </div>
            
        </div>
    </>
}


export default TemplatePage;


