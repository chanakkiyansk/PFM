import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for confirmation 📩");
            navigate("/");
        }
    };

    return (
        <div className="form-container">
            <h2>Signup 📝</h2>

            <form onSubmit={handleSignup}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button>Signup</button>
            </form>

            <p onClick={() => navigate("/")}>Back to Login</p>
        </div>
    );
};

export default Signup;