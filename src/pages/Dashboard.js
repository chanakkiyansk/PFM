import React, { useEffect, useState, useCallback } from "react";
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

  // 🔥 CACHE LOCAL DATA
  const getLocalData = () => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  };

  // 🔥 CALCULATE (MEMOIZED)
  const calculate = useCallback((dataset, currentFilter) => {
    let filtered = dataset;
    const now = new Date();

    if (currentFilter === "day") {
      filtered = dataset.filter(
        (i) => new Date(i.date).toDateString() === now.toDateString()
      );
    } else if (currentFilter === "month") {
      filtered = dataset.filter(
        (i) =>
          new Date(i.date).getMonth() === now.getMonth() &&
          new Date(i.date).getFullYear() === now.getFullYear()
      );
    } else if (currentFilter === "year") {
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
  }, []);

  // 🔥 FETCH DATA
  const fetchData = useCallback(async () => {
    const { data: dbData } = await supabase
      .from("transactions")
      .select("*");

    const local = getLocalData();
    const combined = [...(dbData || []), ...local];

    setData(combined);
    calculate(combined, filter);
  }, [calculate, filter]);

  // 🔥 SYNC DATA (OPTIMIZED)
  const syncData = useCallback(async () => {
    const local = getLocalData();
    const unsynced = local.filter(item => item.synced === false);

    if (unsynced.length === 0) return;

    const { error } = await supabase
      .from("transactions")
      .insert(unsynced);

    if (!error) {
      localStorage.setItem("expenses", JSON.stringify([]));
      fetchData(); // refresh once
    }
  }, [fetchData]);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchData();

    if (navigator.onLine) syncData();

    window.addEventListener("online", syncData);
    return () => window.removeEventListener("online", syncData);
  }, [fetchData, syncData]);

  // 🔥 FILTER CHANGE ONLY RE-CALCULATE
  useEffect(() => {
    calculate(data, filter);
  }, [filter, data, calculate]);

  // 🔥 VIEW FILTER
  const getDisplayData = () => {
    if (view === "income") return data.filter(d => d.type === "income");
    if (view === "expense") return data.filter(d => d.type === "expense");
    return data;
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Cash Flow 💰</h2>

      <div style={{ display: "flex", gap: "20px" }}>

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

      <div style={{
        display: "flex",
        marginTop: "30px",
        gap: "20px"
      }}>

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
              <span>{item.category || "Other"}</span>
              <span>₹{item.amount}</span>
            </div>
          ))}
        </div>

        <div style={{
          flex: 1,
          background: "#111",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <Graph />
        </div>

      </div>

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