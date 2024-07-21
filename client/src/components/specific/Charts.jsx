import React from "react";

import { Line, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  plugins,
  PointElement,
  Tooltip,
} from "chart.js";
import { purple, purpleLight } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

Chart.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value= []}) => {
  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const DoughnutChart = () => {
  return <div>Charts</div>;
};

export { LineChart, DoughnutChart };
