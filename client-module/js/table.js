export function createTable(data, tableID, isBalanced) {
  // clear previous table
  const tableBody = document.querySelector("#" + tableID + " tbody");
  const tableHead = document.querySelector("#" + tableID + " thead");
  removeTableRows(tableBody);
  removeTableRows(tableHead);

  // creating table
  addTableRows(tableHead, tableBody, data, isBalanced);
}

function addTableRows(tableHead, tableBody, data, isBalanced) {
  const row = document.createElement("tr");
  const specialCell = createCell("");
  specialCell.setAttribute("class", "special-cell");
  specialCell.innerHTML = "X";

  row.appendChild(specialCell);

  const suppliersNumber = data.length;
  const consumersNumber = data[0].length;

  let i;
  for (i = 0; i < consumersNumber - 1; i++) {
    row.appendChild(createCell("C" + (i + 1)));
  }
  if (!isBalanced) row.appendChild(createCell(" F "));
  else row.appendChild(createCell("C" + (i + 2)));

  tableHead.appendChild(row);

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    if (data.length === index + 1 && !isBalanced)
      row.appendChild(createCell(" F "));
    else row.appendChild(createCell("S" + (index + 1)));
    item.forEach((v) => {
      row.appendChild(createCell(parseInt(v)));
    });
    tableBody.appendChild(row);
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function removeTableRows(toRemove) {
  while (toRemove.firstChild) {
    toRemove.removeChild(toRemove.firstChild);
  }
}
