import React, { useState } from "react";
import "../styles/dashboard.css";

const categories = [
    "Travel",
    "Rent",
    "Gas",
    "Utilities",
    "Grocery",
    "Shopping",
    "Food",
    "Entertainment",
    "Health",
    "Other"
];

const AddExpense = () => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Travel");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const entry = {
            id: Date.now() + Math.random(),
            type: "expense",
            amount: Number(amount),
            category,
            date,
            user_email: "test@gmail.com",
            family_id: "FAM001",
            synced: false
        };

        let local = JSON.parse(localStorage.getItem("expenses")) || [];
        local.push(entry);

        localStorage.setItem("expenses", JSON.stringify(local));

        alert("Expense Added ✅");

        setAmount("");
        setCategory("Travel");
        setDate("");
    };

    return (
        <div className="form-container">
            <h2>Add Expense</h2>

            <form onSubmit={handleSubmit} className="form-box">

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {/* SAME UI POSITION — just dropdown now */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button className="submit-btn">Add Expense</button>
            </form>
        </div>
    );
};

export default AddExpense;