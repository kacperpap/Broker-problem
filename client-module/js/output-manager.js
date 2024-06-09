import { createChart } from "./graph.js";
import { createTable } from "./table.js";

let chart;

export function showResults(data, isBalanced) {
  // CHART
  const chartTitle = document.querySelector(
    "#chart-container .results-table-title"
  );
  chartTitle.style.display = "none";

  if (chart) {
    chart.reset();
    console.log("destroyed");
  }
  chart = createChart(
    data.totalCost,
    data.totalRevenue,
    data.intermediaryProfit
  );

  // TABLES
  createTable(data.allocationTable, "results-table", isBalanced);
  createTable(data.unitProfits, "results-table2", isBalanced);
}
