import React from "react";

const SummaryCard = ({ title, amount }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{amount}</p>
    </div>
  );
};

export default SummaryCard;