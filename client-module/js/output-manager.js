import { createChart } from "./graph.js";

export function showResults(data) {
  console.log(data);
  chart = createChart(
    data.totalCost,
    data.totalRevenue,
    data.intermediaryProfit
  );
}
