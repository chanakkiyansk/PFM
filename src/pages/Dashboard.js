import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import Graph from "../components/Graph";
import Calendar from "../components/Calendar";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // ✅ FETCH FROM DB
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*");

    if (!error && data) {
      setData(data);

      const inc = data
        .filter((i) => i.type === "income")
        .reduce((a, b) => a + Number(b.amount), 0);

      const exp = data
        .filter((i) => i.type === "expense")
        .reduce((a, b) => a + Number(b.amount), 0);

      setIncome(inc);
      setExpense(exp);
    }
  };

  // ✅ ONLY PLACE WHERE DB INSERT HAPPENS
  const syncData = async () => {
    const local = JSON.parse(localStorage.getItem("expenses")) || [];

    let updated = [...local];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].synced === false) {
        const { error } = await supabase
          .from("transactions")
          .insert([updated[i]]);

        if (!error) {
          updated[i].synced = true; // ✅ prevent duplicate
        }
      }
    }

    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  // ✅ CONTROLLED USEEFFECT (NO DOUBLE RUN)
  useEffect(() => {
    if (loaded) return;

    setLoaded(true);

    fetchData();

    if (navigator.onLine) {
      syncData();
    }

    window.addEventListener("online", syncData);

    return () => {
      window.removeEventListener("online", syncData);
    };
  }, [loaded]);

  return (
    <>
      <div className="cashflow-box">
        <h3>Cash Flow</h3>
        ₹{income} - ₹{expense} = <b>₹{income - expense}</b>
      </div>

      <div className="middle-section">
        <div className="history">
          <h3>Transactions</h3>

          {data.map((item, index) => (
            <div key={index} className="item">
              <span>{item.type}</span>
              <span>₹{item.amount}</span>
              <span>{item.category}</span>
              <span>{item.date}</span>
            </div>
          ))}
        </div>

        <div className="right-panel">
          <div className="graph">
            <Graph />
          </div>

          <div className="calendar">
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;