export function createTable(data, tableID) {
  // clear previous table
  const tableBody = document.querySelector("#" + tableID +" tbody");
  const tableHead = document.querySelector("#" + tableID +" thead");
  removeTableRows(tableBody);
  removeTableRows(tableHead);

  // creating table
  addTableRows(tableHead, tableBody, data);
}

function addTableRows(tableHead, tableBody, data) {
  const row = document.createElement("tr");
  const specialCell = createCell("");
  specialCell.setAttribute("class", "special-cell");
  specialCell.innerHTML="X"

  row.appendChild(specialCell);
  row.appendChild(createCell("C 1"));
  row.appendChild(createCell("C 2"));
  row.appendChild(createCell("C 3"));
  row.appendChild(createCell(" F "));
  tableHead.appendChild(row);

  data.forEach((item, index) => {
    console.log("eeee");
    const row = document.createElement("tr");
    if(data.length === index+1)
      row.appendChild(createCell(" F "));
    else
      row.appendChild(createCell("S" + (index + 1)));
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
