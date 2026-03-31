import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Accounts from "./pages/Accounts";
import Insights from "./components/Insights";
import Predictions from "./pages/Predictions";
import Chatbot from "./pages/Chatbot";
import supabase from "./supabaseClient";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔥 GET CURRENT SESSION
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user || null);
            setLoading(false);
        };

        getSession();

        // 🔥 LISTEN TO AUTH CHANGES
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Router>
            {!user ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/chat" element={<Chatbot />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            ) : (
                <div className="dashboard">
                    <Sidebar />

                    <div className="main">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/add" element={<AddExpense />} />
                            <Route path="/income" element={<AddIncome />} />
                            <Route path="/accounts" element={<Accounts />} />
                            <Route path="/insights" element={<Insights />} />
                            <Route path="/predictions" element={<Predictions />} />
                            <Route path="/chat" element={<Chatbot />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            )}
        </Router>
    );
}

export default App;