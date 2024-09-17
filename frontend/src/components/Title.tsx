import React from "react";

import "../styles/components/Title.css";

type ButtonProps = {
    text: string;
};

const Button: React.FC<ButtonProps> = ({
    text
}) => {

    return (
        <div className="title">
            <h1>{text}</h1>
        </div>
    );
};

export default Button;
