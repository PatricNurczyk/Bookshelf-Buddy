import React from "react";
import LoginButton from "./LoginButton";
import LogoutButton from "./logoutButton";
import bBuddyLogo from '/logo.png'
import "../stylesheets/loginManager.css"


function LoginManager(isAuthenticated) {
    if (isAuthenticated.isAuthenticated === false){
        return (
            <div className="topbar">
                <img src={bBuddyLogo} className="book-logo" alt="bookshelf buddy logo" />
                <LoginButton></LoginButton>
            </div>
        );
    }
    else{
        return (
            <div className="topbar">
                <img src={bBuddyLogo} className="book-logo" alt="bookshelf buddy logo" />
                <LogoutButton></LogoutButton>
            </div>
           
        );
    }

};

export default LoginManager;