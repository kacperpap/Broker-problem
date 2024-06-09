document
  .getElementById("generate-tables")
  .addEventListener("click", generateTables);

function generateTables() {
  supplierTable();
  try {
    consumerTable();
  } catch (error) {
    console.log(error);
  }
}

function supplierTable() {
  const rows = document.getElementById("suppliers-number").value;
  const cols = 2;

  const table = document.getElementById("suppliers");

  // clear previous table
  table.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");

    const tdHeader = document.createElement("td");
    tdHeader.className = "thead-sup";
    tdHeader.textContent = `Supplier ${i + 1}`;
    tr.appendChild(tdHeader);

    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.placeholder = j === 0 ? "supply" : "buying cost";
      input.className = j === 0 ? "supply-input" : "buy-input";
      input.required = true;
      input.min = 0;
      td.appendChild(input);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
}

function consumerTable() {
  const rowsSuppliers = document.getElementById("suppliers-number").value;
  const colsConsumers = document.getElementById("customers-number").value;

  const table = document.getElementById("customers");

  // clear previous table
  table.innerHTML = "";

  // ---- making header ----
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const trHead = document.createElement("tr");
  const trDemand = document.createElement("tr");
  const trSales = document.createElement("tr");

  // headers
  for (let i = 0; i < colsConsumers; i++) {
    const th = document.createElement("th");
    th.textContent = `Customer ${i + 1}`;
    trHead.appendChild(th);
  }
  thead.appendChild(trHead);
  table.appendChild(thead);

  // demand
  for (let i = 0; i < colsConsumers; i++) {
    trDemand.appendChild(createTableCell("demand", "demand-input"));
  }
  tbody.appendChild(trDemand);

  // sales
  for (let i = 0; i < colsConsumers; i++) {
    trSales.appendChild(createTableCell("sales price", "sales-input"));
  }
  tbody.appendChild(trSales);

  // transport
  for (let i = 0; i < rowsSuppliers; i++) {
    const trTransport = document.createElement("tr");
    for (let j = 0; j < colsConsumers; j++) {
      trTransport.appendChild(
        createTableCell("cost of transport", "cost-input")
      );
    }
    tbody.appendChild(trTransport);
  }
  table.appendChild(tbody);
}

function createTableCell(placeholder, className) {
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = placeholder;
  input.className = className;
  input.required = true;
  input.min = 0;
  td.appendChild(input);
  return td;
}
