import React from "react";

const Header = () => {
    return (
        <div className="header">
            <h2>PFM Dashboard 💰</h2>
        </div>
    );
};
<button
    className="logout-btn"
    onClick={() => {
        localStorage.removeItem("isAuth");
        window.location.reload();
    }}
>
    Logout
</button>
export default Header;