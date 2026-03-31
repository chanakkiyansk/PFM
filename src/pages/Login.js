import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        }
        // ❌ REMOVE navigate("/")
        // ✅ App.js will auto-redirect after login
    };

    // 🔥 GOOGLE LOGIN
    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:3000"
            }
        });
    };

    return (
        <div className="form-container">
            <h2>Login 🔐</h2>

            <form onSubmit={handleLogin} className="form-box">
                <input
                    type="email"
                    placeholder="Email"
                    value={email} // ✅ FIX
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password} // ✅ FIX
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            <button onClick={handleGoogle} style={{ marginTop: "10px" }}>
                Sign in with Google 🚀
            </button>

            <p onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>
                Signup
            </p>
        </div>
    );
};

export default Login;