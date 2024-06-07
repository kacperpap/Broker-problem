import { showResults } from "./output-manager.js";

document
  .getElementById("main-content")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    prepareDataToSend();
  });

function prepareDataToSend() {
  const suppliers = ["Supplier1", "Supplier2"];
  const consumers = ["Consumer1", "Consumer2", "Consumer3"];

  const supply = Array.from(
    document.getElementsByClassName("supply-input")
  ).map((input) => input.value);
  const demand = Array.from(
    document.getElementsByClassName("demand-input")
  ).map((input) => input.value);
  const purchaseCosts = Array.from(
    document.getElementsByClassName("buy-input")
  ).map((input) => input.value);

  const sellingCosts = Array.from(
    document.getElementsByClassName("sales-input")
  ).map((input) => input.value);

  const transportTmp = Array.from(
    document.getElementsByClassName("cost-input")
  );
  const transportationCosts = [
    transportTmp.map((input) => input.value).slice(0, 3),
    transportTmp.map((input) => input.value).slice(3, 6),
  ];

  const objectToSend = {
    suppliers,
    consumers,
    supply,
    demand,
    purchaseCosts,
    sellingCosts,
    transportationCosts,
  };
  if (validateInputs(objectToSend)) send(objectToSend);
  else alert("Please fill out all fields.");
}

function validateInputs(objectToSend) {
  Object.entries(objectToSend).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.includes(undefined)) return false;
    }
  });
  return true;
}

// Wysłanie zapytania POST
async function send(dataToSend) {
  try {
    const response = await fetch("http://localhost:3000/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Data successfully fetched", data);
    showResults(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

