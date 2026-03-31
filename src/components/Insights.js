import React, { useEffect, useState } from "react";

const Insights = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        let total = 0;
        let categoryMap = {};

        expenses.forEach((item) => {
            const amount = Number(item.amount);
            total += amount;

            if (categoryMap[item.category]) {
                categoryMap[item.category] += amount;
            } else {
                categoryMap[item.category] = amount;
            }
        });

        let maxCategory = "";
        let maxAmount = 0;

        for (let key in categoryMap) {
            if (categoryMap[key] > maxAmount) {
                maxAmount = categoryMap[key];
                maxCategory = key;
            }
        }

        if (total === 0) {
            setMessage("No data available.");
        } else if (maxAmount > total * 0.5) {
            setMessage(`⚠️ You are overspending on ${maxCategory}`);
        } else {
            setMessage("✅ Spending is balanced");
        }
    }, []);

    return (
        <div className="insights">
            <h3>AI Insights 🤖</h3>
            <p>{message}</p>
        </div>
    );
};

export default Insights;