import React from "react";

import "../../assets/styles/components/form/Button.css"

type ButtonProps = {
    text: string | JSX.Element;
    onClick: () => void;
    disabled?: boolean;
    additionalClass?: string;
};

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    disabled = false,
    additionalClass = ""
}) => {

    const btnClass = additionalClass ? `button ${additionalClass}` : "button";

    return (
        <button className={btnClass} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
};

export default Button;
