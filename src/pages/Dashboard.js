import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import Graph from "../components/Graph";
import Calendar from "../components/Calendar";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [filter, setFilter] = useState("month");
  const [view, setView] = useState("all");

  // 🔥 FETCH FROM DB + LOCAL
  const fetchData = async () => {
    const { data: dbData } = await supabase
      .from("transactions")
      .select("*");

    const local = JSON.parse(localStorage.getItem("expenses")) || [];

    const combined = [...(dbData || []), ...local];
    setData(combined);

    calculate(combined);
  };

  // 🔥 CALCULATE
  const calculate = (dataset) => {
    let filtered = dataset;
    const now = new Date();

    if (filter === "day") {
      filtered = dataset.filter(
        (i) => new Date(i.date).toDateString() === now.toDateString()
      );
    } else if (filter === "month") {
      filtered = dataset.filter(
        (i) =>
          new Date(i.date).getMonth() === now.getMonth() &&
          new Date(i.date).getFullYear() === now.getFullYear()
      );
    } else if (filter === "year") {
      filtered = dataset.filter(
        (i) => new Date(i.date).getFullYear() === now.getFullYear()
      );
    }

    const inc = filtered
      .filter((i) => i.type === "income")
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const exp = filtered
      .filter((i) => i.type === "expense")
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    setIncome(inc);
    setExpense(exp);
  };

  // 🔥 AUTO SYNC + CLEAR LOCAL
  const syncData = async () => {
    let local = JSON.parse(localStorage.getItem("expenses")) || [];

    const unsynced = local.filter(item => item.synced === false);

    if (unsynced.length === 0) return;

    console.log("🔄 Syncing data...");

    const { error } = await supabase
      .from("transactions")
      .insert(unsynced);

    if (!error) {
      // 🔥 CLEAR LOCAL AFTER SUCCESS
      localStorage.setItem("expenses", JSON.stringify([]));
      console.log("✅ Synced & cleared localStorage");

      fetchData(); // refresh UI
    } else {
      console.log("❌ Sync failed:", error.message);
    }
  };

  useEffect(() => {
    fetchData();

    if (navigator.onLine) {
      syncData();
    }

    window.addEventListener("online", syncData);

    return () => {
      window.removeEventListener("online", syncData);
    };
  }, []);

  useEffect(() => {
    calculate(data);
  }, [filter]);

  // 🔥 FILTER VIEW
  const getDisplayData = () => {
    if (view === "income") return data.filter(d => d.type === "income");
    if (view === "expense") return data.filter(d => d.type === "expense");
    return data;
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* CASH FLOW */}
      <h2>Cash Flow 💰</h2>

      <div style={{ display: "flex", gap: "20px" }}>

        {/* CARDS */}
        <div style={{ flex: 3 }}>
          <div className="card-container">

            <div className="card" onClick={() => setView("income")} style={{ cursor: "pointer" }}>
              Income: ₹{income}
            </div>

            <div className="card" onClick={() => setView("expense")} style={{ cursor: "pointer" }}>
              Expense: ₹{expense}
            </div>

            <div className="card" onClick={() => setView("all")} style={{ cursor: "pointer" }}>
              Total: ₹{income - expense}
            </div>

          </div>
        </div>

        {/* FILTER */}
        <div style={{
          flex: 1,
          background: "#111",
          padding: "15px",
          borderRadius: "10px",
          color: "white"
        }}>
          <h4>Frequency</h4>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          >
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* 🔥 DATA + GRAPH */}
      <div style={{
        display: "flex",
        marginTop: "30px",
        gap: "20px"
      }}>

        {/* DATA PANEL */}
        <div style={{
          flex: 2,
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "10px",
          height: "250px",
          overflowY: "auto"
        }}>
          <h4>
            {view === "income" && "Income"}
            {view === "expense" && "Expense"}
            {view === "all" && "Transactions"}
          </h4>

          {getDisplayData().slice(-6).map((item, index) => (
            <div key={item.id + index} style={{
              padding: "8px",
              marginTop: "8px",
              background: "white",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px"
            }}>
              <span>{item.category}</span>
              <span>₹{item.amount}</span>
            </div>
          ))}
        </div>

        {/* GRAPH */}
        <div style={{
          flex: 1,
          background: "#111",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <Graph />
        </div>

      </div>

      {/* 🔥 CALENDAR */}
      <div style={{
        display: "flex",
        marginTop: "20px",
        gap: "20px"
      }}>
        <div style={{ flex: 2 }}></div>

        <div style={{
          flex: 1,
          background: "#111",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <Calendar />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;