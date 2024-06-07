document
  .getElementById("send-data")
  .addEventListener("click", prepareDataToSend);

function prepareDataToSend() {
  const suppliers = ["Supplier1", "Supplier2"];
  const consumers = ["Consumer1", "Consumer2", "Consumer3"];

  // tutaj powinna byc funkcja walidacji danych (czy wszystkie inputy sa uzupelnione)

  const supply = Array.from(document.getElementsByClassName("supply-input"));
  const supplyArray = supply.map((input) => input.value);

  const demand = Array.from(document.getElementsByClassName("demand-input"));
  const demandArray = demand.map((input) => input.value);

  const purchaseCosts = Array.from(document.getElementsByClassName("buy-input"));
  const purchaseCostsArray = purchaseCosts.map((input) => input.value);
  console.log(purchaseCostsArray);

  const sellingCosts = Array.from(document.getElementsByClassName("sales-input"));
  const sellingCostsArray = sellingCosts.map((input) => input.value);

  // filter pierwsze 3 potem kolejne 3 ...
  // "transportationCosts": [[4, 7, 2], [8, 10, 4]]
}

function showResults() {}
