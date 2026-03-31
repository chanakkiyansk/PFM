import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Insights from "./components/Insights";
import Predictions from "./pages/Predictions";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    const [isAuth, setAuth] = useState(localStorage.getItem("isAuth") === "true");

    return (
        <Router>
            {!isAuth ? (
                <Routes>
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/" element={<Login setAuth={setAuth} />} />
                    <Route path="/signup" element={<Signup setAuth={setAuth} />} />
                    <Route path="/predictions" element={<Predictions />} />
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
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            )}
        </Router>
    );
}

export default App;