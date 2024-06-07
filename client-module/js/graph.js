export function createChart(totalCost, totalRevenue, intermediaryProfit) {
  let ctx = document.getElementById("results-chart").getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Total cost", "Profit"],
      datasets: [
        {
          data: [totalRevenue, totalCost, intermediaryProfit],
          backgroundColor: ["#a27b5c90", "#3f4e4f74", "#2c36397b"],
          borderColor: ["#a27b5c", "#3f4e4f", "#2c3639"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "RESULTS",
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: function (value, context) {
            return value;
          },
        },
      },
    },
  });
}
