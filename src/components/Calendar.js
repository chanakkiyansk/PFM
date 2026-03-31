import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

const Calendar = () => {
  const [notes, setNotes] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(saved);

    // 🔔 Reminder popup for today
    if (saved[todayStr]) {
      alert("Reminder: " + saved[todayStr]);
    }
  }, []);

  // 📅 Month navigation
  const changeMonth = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ✅ Days logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ✅ Monday start (0 = Monday)
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = (firstDay === 0 ? 6 : firstDay - 1);

  const calendarDays = [];

  // empty slots
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // actual dates
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(year, month, i)
      .toISOString()
      .split("T")[0];

    calendarDays.push(fullDate);
  }

  const handleClick = (date) => {
    if (!date) return;

    const existing = notes[date] || "";

    const action = prompt(
      `Date: ${date}\n\nType:\n1 → Add/Edit\n2 → Delete`,
      "1"
    );

    if (action === "1") {
      const note = prompt("Enter note:", existing);
      if (note) {
        const updated = { ...notes, [date]: note };
        setNotes(updated);
        localStorage.setItem("notes", JSON.stringify(updated));
      }
    }

    if (action === "2") {
      const updated = { ...notes };
      delete updated[date];
      setNotes(updated);
      localStorage.setItem("notes", JSON.stringify(updated));
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      {/* HEADER */}
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>⬅️</button>
        <h3>{monthYear}</h3>
        <button onClick={() => changeMonth(1)}>➡️</button>
      </div>

      {/* WEEKDAYS */}
      <div className="calendar-grid header">
        {weekDays.map((d) => (
          <div key={d} className="day header-day">{d}</div>
        ))}
      </div>

      {/* DAYS */}
      <div className="calendar-grid">
        {calendarDays.map((date, i) => (
          <div
            key={i}
            className={`day ${date === todayStr ? "today" : ""}`}
            onClick={() => handleClick(date)}
          >
            {date ? date.split("-")[2] : ""}

            {date && notes[date] && (
              <div style={{ fontSize: "10px" }}>🔔</div>
            )}
          </div>
        ))}
      </div>

      {/* REMINDER LIST */}
      <h4 style={{ marginTop: "15px" }}>Reminders</h4>
      <ul>
        {Object.entries(notes).map(([date, note]) => (
          <li key={date}>
            {date} → {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;