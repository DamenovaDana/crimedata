import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const MaeScatterChart = ({ results }) => {
  const categories = ["murders", "rapes", "robberies", "assaults", "burglaries", "larcenies", "autoTheft", "arsons"];

  const points = results.map((result) => ({
    x: categories.indexOf(result.category), 
    y: result.value,
  }));

  const data = {
    datasets: [
      {
        label: "All Data",
        data: points,
        backgroundColor: "rgba(75, 192, 192, 1)", 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const category = categories[context.raw.x]; 
            const value = context.raw.y; 
            return `${category}: ${value}`; 
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Categories",
        },
        ticks: {
          callback: (value) => categories[value],
        },
      },
      y: {
        title: {
          display: true,
          text: "MAE",
        },
        min: 0,
        max: 300,
      },
    },
  };
  

  return (
    <div className="scatter-chart">
      <Scatter data={data} options={options} style={{ width: '800px', height: '500px' }} />
    </div>
  );
};

export default MaeScatterChart;
