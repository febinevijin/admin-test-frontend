import React from "react";
import { LineChartExample } from "../components/Component";

const GraphWrapper = ({ graphData,weeklyInterest }) => {
  const solidLineChart = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dataUnit: "BTC",
    lineTension: 0.4,
    legend: true,
    categoryPercentage: 0.9,
    barPercentage: 0.6,
    datasets: [
      {
        label: "Investment",
        borderColor: "#5ce0aa",
        backgroundColor: "white",
        pointBorderWidth: 2,
        fill: false,
        categoryPercentage: 0.9,
        barPercentage: 0.6,
        data: graphData.map((item) => item.invested), // Map invested amounts for each month,
      },
      {
        label: "Payout",
        borderColor: "#ff0f0f",
        backgroundColor: "white",
        pointBorderWidth: 2,
        fill: false,
        categoryPercentage: 0.9,
        barPercentage: 0.6,
        data: graphData.map((item) => item.withdrawn), // Map withdrawn amounts for each month
      },
      {
        label: "Deposite",
        backgroundColor: "white",
        pointBorderWidth: 2,
        borderColor: "#798bff",
        fill: false,
        categoryPercentage: 0.9,
        barPercentage: 0.6,
        data: graphData.map((item) => item.deposited), // Map deposited amounts for each month
      },
      // {
      //   label: "Deposite Bonus",
      //   backgroundColor: "white",
      //   pointBorderWidth: 2,
      //   borderColor: "#ffa9ce",
      //   fill: false,
      //   categoryPercentage: 0.9,
      //   barPercentage: 0.6,
      //   data: [80, 54, 20, 120, 82, 120, 60, 80, 54, 20, 120, 20],
      // },
      {
        label: "Investment Bonus",
        backgroundColor: "white",
        pointBorderWidth: 2,
        borderColor: "#f9db7b",
        fill: false,
        categoryPercentage: 0.9,
        barPercentage: 0.6,
        data: graphData.map((item) => item.interest), // Map interest amounts (as investment bonus)
      },
    ],
  };

  // Process weeklyInterest for the second chart
  const solidLineChart2 = {
    labels: weeklyInterest.map((item) => item.day), // Days of the week
    dataUnit: "Interest",
    lineTension: 0.4,
    legend: true,
    categoryPercentage: 0.9,
    barPercentage: 0.6,
    datasets: [
      {
        label: "Weekly Interest",
        borderColor: "#798bff",
        backgroundColor: "white",
        pointBorderWidth: 2,
        fill: false,
        categoryPercentage: 0.9,
        barPercentage: 0.6,
        data: weeklyInterest.map((item) => item.interest), // Map interest amounts for each day
      },
    ],
  };

  return (
    <>
      <div>
        <LineChartExample legend={true} data={solidLineChart} />
      </div>

      <div>
        <LineChartExample legend={true} data={solidLineChart2} />
      </div>
    </>
  );
};

export default GraphWrapper;
