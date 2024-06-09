import { createChart } from "./graph.js";
import { createTable } from "./table.js";

export function showResults(data) {
  console.log(data);

  // CHART
  const chartTitle = document.querySelector(
    "#chart-container .results-table-title"
  );
  chartTitle.style.display = "none";

  const chart = createChart(
    data.totalCost,
    data.totalRevenue,
    data.intermediaryProfit
  );

  // TABLES
  createTable(data.allocationTable, "results-table");
  createTable(data.unitProfits, "results-table2");
}
