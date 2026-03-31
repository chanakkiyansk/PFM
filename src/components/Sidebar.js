import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className={open ? "sidebar open" : "sidebar closed"}>
      <div className="toggle-btn" onClick={() => setOpen(!open)}>☰</div>

      <h2 className="logo">💰 {open && "PFM"}</h2>

      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            🏠 {open && "Dashboard"}
          </NavLink>
        </li>

        <li>
          <NavLink to="/income" className={({ isActive }) => isActive ? "active" : ""}>
            💰 {open && "Income"}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/insights"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            📊 {open && "Insights"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
            ➕ {open && "Expense"}
          </NavLink>
        </li>
      </ul>

      <div
        className="bottom"
        onClick={() => {
          localStorage.removeItem("isAuth");
          window.location.reload();
        }}
      >
        🚪 {open && "Logout"}
      </div>
    </div>
  );
};

export default Sidebar;