import { createChart } from "./graph.js";
import { createTable } from "./table.js";

export function showResults(data) {
  console.log(data);

  // CHART
  const chart = createChart(
    data.totalCost,
    data.totalRevenue,
    data.intermediaryProfit
  );

  // TABLE
  createTable(data);
}
