import { createChart } from "./graph.js";
import { createTable } from "./table.js";

export function showResults(data) {
  console.log(data);

  // TITLES
  const titles = document.getElementsByClassName("results-table-title");
  for (let i = 0; i < titles.length; i++) {
    titles[i].style.position = "relative";
  }


  // CHART
  const chart = createChart(
    data.totalCost,
    data.totalRevenue,
    data.intermediaryProfit
  );

  // TABLES
  createTable(data.allocationTable, "results-table");
  createTable(data.unitProfits, "results-table2");
}
