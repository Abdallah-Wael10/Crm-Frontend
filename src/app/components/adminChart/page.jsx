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

const AdminChart = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  const labels = stats.map((item) => item.user.username);

  const data = {
    labels,
    datasets: [
      {
        label: "Customers",
        data: stats.map((item) => item.totalCustomers),
        backgroundColor: "rgba(59,130,246,0.6)",
      },
      {
        label: "Deals",
        data: stats.map((item) => item.totalDeals),
        backgroundColor: "rgba(16,185,129,0.6)",
      },
      {
        label: "Won Deals",
        data: stats.map((item) => item.wonDeals),
        backgroundColor: "rgba(34,197,94,0.6)",
      },
      {
        label: "Lost Deals",
        data: stats.map((item) => item.lostDeals),
        backgroundColor: "rgba(239,68,68,0.6)",
      },
      {
        label: "Pending Deals",
        data: stats.map((item) => item.pendingDeals),
        backgroundColor: "rgba(253,224,71,0.6)",
      },
      {
        label: "Open Tasks",
        data: stats.map((item) => item.openTasks),
        backgroundColor: "rgba(6,182,212,0.6)",
      },
      {
        label: "Done Tasks",
        data: stats.map((item) => item.doneTasks),
        backgroundColor: "rgba(99,102,241,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Users Statistics Overview",
      },
    },
  };

  return (
    <div className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AdminChart;
