import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Login = ({ setAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.username === username && user.password === password) {
            localStorage.setItem("isAuth", "true");
            setAuth(true);
        } else {
            alert("Invalid credentials ❌");
        }
    };

    return (
        <div className="form-container">
            <h2>Login 🔐</h2>

            <form onSubmit={handleLogin} className="form-box">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="submit-btn">Login</button>
            </form>

            {/* 👉 SIGNUP LINK */}
            <p style={{ marginTop: "15px" }}>
                Don't have an account?{" "}
                <span
                    style={{ color: "#00adb5", cursor: "pointer" }}
                    onClick={() => navigate("/signup")}
                >
                    Signup
                </span>
            </p>
        </div>
    );
};

export default Login;