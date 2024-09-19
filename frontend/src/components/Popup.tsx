import React, { ReactNode } from "react";
import { RxCross1 } from "react-icons/rx";

import "../styles/components/Popup.css";

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
        <div className="popup-bottom">{footer}</div>
      </div>
    </div>
  );
};

export default Popup;
