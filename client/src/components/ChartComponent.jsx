import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: data.map((c) => c.country),
    datasets: [
      {
        label: "Cases",
        data: data.map((c) => c.cases),
        borderColor: "rgba(75,192,192,1)",
        fill: false
      },
      {
        label: "Deaths",
        data: data.map((c) => c.deaths),
        borderColor: "rgba(255,99,132,1)",
        fill: false
      }
    ]
  };

  return (
    <div className="chart-container">
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
