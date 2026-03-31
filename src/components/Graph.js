import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import supabase from "../supabaseClient";

ChartJS.register(ArcElement, Tooltip, Legend);

const Graph = () => {
  const [dataSet, setDataSet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      // 🔥 GET FROM DB
      const { data: dbData } = await supabase
        .from("transactions")
        .select("*");

      // 🔥 GET LOCAL (offline)
      const local = JSON.parse(localStorage.getItem("expenses")) || [];

      const combined = [...(dbData || []), ...local];

      // 🔥 FILTER EXPENSE
      const expenseOnly = combined.filter(
        (i) => i.type === "expense"
      );

      // 🔥 GROUP BY CATEGORY
      const grouped = {};
      expenseOnly.forEach((item) => {
        const cat = item.category || "Other";
        grouped[cat] =
          (grouped[cat] || 0) + Number(item.amount || 0);
      });

      const labels = Object.keys(grouped);
      const values = Object.values(grouped);

      // 🔥 DYNAMIC COLORS
      const colors = [
        "#00adb5",
        "#ff9f43",
        "#10ac84",
        "#ee5253",
        "#5f27cd",
        "#54a0ff",
        "#f368e0",
        "#ff6b6b",
        "#1dd1a1",
        "#576574"
      ];

      setDataSet({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, labels.length),
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>Expense Chart 📊</h3>

      {dataSet && dataSet.labels.length > 0 ? (
        <Pie data={dataSet} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Graph;