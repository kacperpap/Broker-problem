export function createTable(data) {
  const titles = document.getElementsByClassName("results-table-title");
  for (let i = 0; i < titles.length; i++) {
    titles[i].style.position = "relative";
  }

  //TODO: clear previous table

  // creating table
  const tableBody = document.querySelector("#results-table tbody");
  const tableHead = document.querySelector("#results-table thead");

  const row = document.createElement("tr");
  const specialCell = createCell("");
  specialCell.setAttribute("id", "special-cell");

  row.appendChild(specialCell);
  row.appendChild(createCell("Consumer 1"));
  row.appendChild(createCell("Consumer 2"));
  row.appendChild(createCell("Consumer 3"));
  tableHead.appendChild(row);

  data.allocationTableRealRoutes.forEach((item, index) => {
    const row = document.createElement("tr");
    row.appendChild(createCell("Supplier" + (index + 1)));
    item.forEach((v) => {
      row.appendChild(createCell(v));
    });
    tableBody.appendChild(row);
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}
