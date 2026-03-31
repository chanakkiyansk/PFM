import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Graph = () => {
  const [dataSet, setDataSet] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("expenses")) || [];

    const expenseOnly = data.filter((i) => i.type === "expense");

    const grouped = {};
    expenseOnly.forEach((item) => {
      grouped[item.category] =
        (grouped[item.category] || 0) + item.amount;
    });

    setDataSet({
      labels: Object.keys(grouped),
      datasets: [
        {
          data: Object.values(grouped),
          backgroundColor: [
            "#00adb5",
            "#ff9f43",
            "#10ac84",
            "#ee5253",
            "#5f27cd",
          ],
        },
      ],
    });
  }, []);

  return (
    <div>
      <h3>Expense Chart 📊</h3>
      {dataSet.labels && <Pie data={dataSet} />}
    </div>
  );
};

export default Graph;