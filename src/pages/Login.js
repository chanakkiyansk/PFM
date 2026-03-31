import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/dashboard.css";

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            localStorage.setItem("isAuth", "true");
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("family_id", "FAM001");

            setAuth(true);
            navigate("/");
        }
    };

    // 🔥 GOOGLE LOGIN
    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    return (
        <div className="form-container">
            <h2>Login 🔐</h2>

            <form onSubmit={handleLogin} className="form-box">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="submit-btn">Login</button>
            </form>

            {/* GOOGLE BUTTON */}
            <button
                onClick={handleGoogleLogin}
                style={{
                    marginTop: "15px",
                    background: "#4285F4",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%",
                }}
            >
                Sign in with Google 🚀
            </button>

            <p
                style={{ marginTop: "15px", cursor: "pointer", color: "#00adb5" }}
                onClick={() => navigate("/signup")}
            >
                Don't have an account? Signup
            </p>
        </div>
    );
};

export default Login;