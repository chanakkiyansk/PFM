import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Signup = ({ setAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        const existingUser = JSON.parse(localStorage.getItem("user"));

        // ✅ CHECK IF USER ALREADY EXISTS
        if (existingUser && existingUser.username === username) {
            alert("Account already exists ❌ Please login");
            navigate("/"); // go to login
            return;
        }

        // ✅ CREATE NEW USER
        const newUser = { username, password };
        localStorage.setItem("user", JSON.stringify(newUser));

        alert("Signup successful ✅");

        localStorage.setItem("isAuth", "true");
        setAuth(true);
    };

    return (
        <div className="form-container">
            <h2>Signup 📝</h2>

            <form onSubmit={handleSignup} className="form-box">
                <input
                    type="text"
                    placeholder="Create Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="submit-btn">Signup</button>
            </form>

            {/* BACK TO LOGIN */}
            <p
                style={{ marginTop: "15px", cursor: "pointer", color: "#00adb5" }}
                onClick={() => navigate("/")}
            >
                Already have account? Login
            </p>
        </div>
    );
};

export default Signup;