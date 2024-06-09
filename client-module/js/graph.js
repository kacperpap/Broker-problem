export function createChart(totalCost, totalRevenue, intermediaryProfit) {
  let ctx = document.getElementById("results-chart").getContext("2d");
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Total cost", "Profit"],
      datasets: [
        {
          data: [parseInt(totalRevenue), parseInt(totalCost), parseInt(intermediaryProfit)],
          backgroundColor: ["#a27b5c90", "#3f4e4f74", "#2c36397b"],
          borderColor: ["#a27b5c", "#3f4e4f", "#2c3639"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      // responsive: true,
      legend: { display: false },
      title: {
        display: true,
        text: "RESULT",
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
          color: "#2c3639",
          font: {
            weight: "bold",
          },
          formatter: function (value, context) {
            return value;
          },
        },
      },
    },
  });
}
