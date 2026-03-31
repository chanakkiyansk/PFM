import React, { useState } from "react";
import supabase from "../supabaseClient";
import "../styles/dashboard.css";

const AddIncome = () => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const saveToDB = async (entry) => {
        const { error } = await supabase
            .from("transactions")
            .insert([entry]);

        if (error) console.log("DB ERROR:", error.message);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const entry = {
            id: Date.now(),
            type: "income", // ✅ FIXED
            amount: Number(amount),
            category,
            date,
            user_email: "test@gmail.com",
            family_id: "FAM001",
            synced: false
        };

        let local = JSON.parse(localStorage.getItem("expenses")) || [];
        local.push(entry);

        if (navigator.onLine) {
            await saveToDB(entry);
            entry.synced = true;
        }

        localStorage.setItem("expenses", JSON.stringify(local));

        alert("Income Added ✅");

        setAmount("");
        setCategory("");
        setDate("");
    };

    return (
        <div className="form-container">
            <h2>Add Income</h2>

            <form onSubmit={handleSubmit} className="form-box">
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button className="submit-btn">Add Income</button>
            </form>
        </div>
    );
};

export default AddIncome;