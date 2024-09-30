import React, { ReactNode } from "react";
import { RxCross1 } from "react-icons/rx";

import "../../assets/styles/components/form/Popup.css";

type PopupProps = {
  title: string;
  onClosePopup: () => void;
  footer?: ReactNode;
  children?: ReactNode;
};

const Popup: React.FC<PopupProps> = ({ title, children, footer, onClosePopup }) => {
  return (
    <div className="popup">
      <div className="popup-container">
        <div className="popup-header">
            <h2>{title}</h2>
            <RxCross1 onClick={onClosePopup}/>
        </div>
        <div className="popup-content">{children}</div>
        <div className="popup-footer">{footer}</div>
      </div>
    </div>
  );
};

export default Popup;
