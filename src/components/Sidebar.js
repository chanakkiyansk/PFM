import { Link } from "react-router-dom";
import supabase from "../supabaseClient";

export default function Sidebar() {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "#020617",
      padding: "20px",
      color: "white"
    }}>
      <h2>💰 PFM</h2>

      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginTop: "20px"
      }}>
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/add">➖ Expense</Link>
        <Link to="/income">➕ Income</Link>
        <Link to="/accounts">👨‍👩‍👧 Accounts</Link>
        <Link to="/insights">🤖 Insights</Link>
        <Link to="/predictions">🔮 Predictions</Link>

        {/* 🔥 LOGOUT */}
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout 🚪
        </button>
      </nav>
    </div>
  );
}