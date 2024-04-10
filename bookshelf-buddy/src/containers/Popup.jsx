import React from "react";
import "../stylesheets/popup.css"

function Popup(props) {

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h2 className="title">{props.title}</h2>
                <button className="close-btn" onClick={() => {props.onClose(false)}}>
                </button>
                <div className="popup-form">
                    {props.children}
                </div>
            </div>
        </div>
    ) : "";
};

export default Popup;