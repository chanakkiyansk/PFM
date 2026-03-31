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
import supabase from "./supabaseClient";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 CHECK AUTH
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        getUser();

        // listen to auth changes (google login etc)
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Router>
            {!user ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
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
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            )}
        </Router>
    );
}

export default App;