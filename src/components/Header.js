import React from "react";

const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem("isAuth");
        window.location.reload();
    };

    return (
        <div className="header">
            <h2>PFM Dashboard 💰</h2>
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Header;