import { send } from "./send-request.js";

document.getElementById("main-content").addEventListener("submit", (event) => {
  event.preventDefault();
  prepareDataToSend();
});

function prepareDataToSend() {
  const tableS = document.getElementById("suppliers").innerHTML;
  const tableC = document.getElementById("suppliers").innerHTML;
  if (tableS === "" || tableC === "") showEmptyTablesWarning();
  else {
    const supply = Array.from(
      document.getElementsByClassName("supply-input")
    ).map((input) => parseInt(input.value), 10);
    const demand = Array.from(
      document.getElementsByClassName("demand-input")
    ).map((input) => parseInt(input.value), 10);
    const purchaseCosts = Array.from(
      document.getElementsByClassName("buy-input")
    ).map((input) => parseInt(input.value), 10);

    const sellingCosts = Array.from(
      document.getElementsByClassName("sales-input")
    ).map((input) => parseInt(input.value), 10);

    const transportTmp = Array.from(
      document.getElementsByClassName("cost-input")
    );

    const supplierNumber = supply.length;
    const consumersNumber = demand.length;
    const transportationCosts = [];

    for (let i = 0; i < supplierNumber; i++) {
      transportationCosts.push(
        transportTmp
          .map((input) => parseInt(input.value), 10)
          .slice(i * consumersNumber, (i + 1) * consumersNumber)
      );
    }

    const suppliers = [];
    const consumers = [];
    for (let i = 0; i < supplierNumber; i++) {
      suppliers.push("S" + (i + 1));
    }
    for (let i = 0; i < consumersNumber; i++) {
      consumers.push("C" + (i + 1));
    }

    const objectToSend = {
      suppliers,
      consumers,
      supply,
      demand,
      purchaseCosts,
      sellingCosts,
      transportationCosts,
    };

    // is balanced
    let sum1 = supply.reduce((sum, e) => sum + e, 0);
    let sum2 = demand.reduce((sum, e) => sum + e, 0);
    let balanced = false;
    if (sum1 === sum2) {
      balanced = true;
    }

    //send 
    console.log(objectToSend);
    send(objectToSend, balanced);
  }
}

function showEmptyTablesWarning() {
  Swal.fire({
    position: "top-end",
    icon: "warning",
    title: "Please fill table with valid data",
    footer: "First choose number of customers and suppliers",
    showConfirmButton: false,
    timer: 1500,
  });
}


// TEST data
// const objectToSend = {
//   suppliers: ["s1", "s2"],
//   consumers: ["c1", "c2", "c3"],
//   supply: [20, 40],
//   demand: [16, 12, 24],
//   purchaseCosts: [7, 8],
//   sellingCosts: [18, 16, 15],
//   transportationCosts: [
//     [4, 7, 2],
//     [8, 10, 4],
//   ],
// };
