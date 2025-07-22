"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserChart = ({ stats }) => {
  const data = {
    labels: [
      "Customers",
      "Deals",
      "Won",
      "Lost",
      "Pending",
      "Open Tasks",
      "Done Tasks",
    ],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.totalCustomers,
          stats.totalDeals,
          stats.wonDeals,
          stats.lostDeals,
          stats.pendingDeals,
          stats.openTasks,
          stats.doneTasks,
        ],
        backgroundColor: [
          "#38bdf8",
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e42",
          "#0ea5e9",
          "#a3e635",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "User CRM Statistics",
        color: "#2563eb",
        font: { size: 18 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#2563eb" } },
      y: { grid: { color: "#e0e7ff" }, ticks: { color: "#2563eb" } },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserChart;
