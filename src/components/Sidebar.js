import { Link } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/dashboard.css";

export default function Sidebar() {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="sidebar">

      <h2>💰 PFM</h2>

      <nav className="sidebar-nav">
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/add">➖ Expense</Link>
        <Link to="/income">➕ Income</Link>
        <Link to="/accounts">👨‍👩‍👧 Accounts</Link>
        <Link to="/insights">🤖 Insights</Link>
        <Link to="/predictions">🔮 Predictions</Link>
        <Link to="/chat">🤖 Chatbot</Link>
      </nav>

      <button onClick={handleLogout}>
        Logout 🚪
      </button>

    </div>
  );
}