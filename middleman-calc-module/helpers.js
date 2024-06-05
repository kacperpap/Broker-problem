function initializeAllocationTable(rows, cols) {
    return Array.from({length: rows}, () => Array(cols).fill(0));
}


function getInitialFeasibleSolutionMaxMatrixElementMethod(supply, demand, unitProfits, allocationTable) {
    let remainingSupply = [...supply];
    let remainingDemand = [...demand];

    // Allocate demand and supply for real suppliers and consumers first
    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        let maxProfit = -Infinity;
        let maxRow = -1;
        let maxCol = -1;

        for (let i = 0; i < unitProfits.length - 1; i++) { // Exclude fictitious supplier
            for (let j = 0; j < unitProfits[i].length - 1; j++) { // Exclude fictitious consumer
                if (remainingSupply[i] > 0 && remainingDemand[j] > 0 && unitProfits[i][j] > maxProfit) {
                    maxProfit = unitProfits[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }

        if (maxRow === -1 || maxCol === -1) break; // Break if no valid allocation found

        let allocation = Math.min(remainingSupply[maxRow], remainingDemand[maxCol]);
        allocationTable[maxRow][maxCol] = allocation;
        remainingSupply[maxRow] -= allocation;
        remainingDemand[maxCol] -= allocation;
    }

    // Allocate remaining supply and demand including fictitious suppliers and consumers
    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        let maxProfit = -Infinity;
        let maxRow = -1;
        let maxCol = -1;

        for (let i = 0; i < unitProfits.length; i++) {
            for (let j = 0; j < unitProfits[i].length; j++) {
                if (remainingSupply[i] > 0 && remainingDemand[j] > 0 && unitProfits[i][j] > maxProfit) {
                    maxProfit = unitProfits[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }

        if (maxRow === -1 || maxCol === -1) break; // Break if no valid allocation found

        let allocation = Math.min(remainingSupply[maxRow], remainingDemand[maxCol]);
        allocationTable[maxRow][maxCol] = allocation;
        remainingSupply[maxRow] -= allocation;
        remainingDemand[maxCol] -= allocation;
    }

    return allocationTable;
}
function getInitialFeasibleSolutionMaxMatrixElementMethodStrict(supply, demand, unitProfits, allocationTable) {
    let remainingSupply = [...supply];
    let remainingDemand = [...demand];

    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        let maxProfit = -Infinity;
        let maxRow = -1;
        let maxCol = -1;

        /***
        Looking for max element in individual unit profit table involves
        searching in rows and columns of fictitious actors, thus if the
        profit of real actor in some route is negative, it will be included
        after fictitious route if needed (more strict condition of positive profits)
        ***/

        for (let i = 0; i < unitProfits.length; i++) {
            for (let j = 0; j < unitProfits[i].length; j++) {
                if (remainingSupply[i] > 0 && remainingDemand[j] > 0 && unitProfits[i][j] > maxProfit) {
                    maxProfit = unitProfits[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }

        let allocation = Math.min(remainingSupply[maxRow], remainingDemand[maxCol]);
        allocationTable[maxRow][maxCol] = allocation;
        remainingSupply[maxRow] -= allocation;
        remainingDemand[maxCol] -= allocation;
    }

    return allocationTable;
}

function getInitialFeasibleSolutionNorthWestCornerMethod(supply, demand, unitProfits, allocationTable) {
    let remainingSupply = [...supply];
    let remainingDemand = [...demand];

    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        let maxProfit = -Infinity;
        let maxRow = -1;
        let maxCol = -1;

        for (let i = 0; i < unitProfits.length; i++) {
            for (let j = 0; j < unitProfits[i].length; j++) {
                if (remainingSupply[i] > 0 && remainingDemand[j] > 0 && unitProfits[i][j] > maxProfit) {
                    maxProfit = unitProfits[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }

        let allocation = Math.min(remainingSupply[maxRow], remainingDemand[maxCol]);
        allocationTable[maxRow][maxCol] = allocation;
        remainingSupply[maxRow] -= allocation;
        remainingDemand[maxCol] -= allocation;
    }

    return allocationTable;
}

function calculateUnitProfits(sellingCosts, purchaseCosts, transportationCosts) {
    let unitProfits = [];
    for (let i = 0; i < purchaseCosts.length; i++) {
        let row = [];
        for (let j = 0; j < sellingCosts.length; j++) {
            row.push(sellingCosts[j] - purchaseCosts[i] - transportationCosts[i][j]);
        }
        unitProfits.push(row);
    }
    return unitProfits;
}

function calculateDeltas(allocationTable, unitProfits) {
    const u = Array(allocationTable.length).fill(null);
    const v = Array(allocationTable[0].length).fill(null);
    u[0] = 0;

    const updateUV = () => {
        for (let i = 0; i < allocationTable.length; i++) {
            for (let j = 0; j < allocationTable[i].length; j++) {
                if (allocationTable[i][j] !== 0) {
                    if (u[i] !== null && v[j] === null) {
                        v[j] = unitProfits[i][j] - u[i];
                    } else if (v[j] !== null && u[i] === null) {
                        u[i] = unitProfits[i][j] - v[j];
                    }
                }
            }
        }
    };

    let filled = false;
    while (!filled) {
        filled = true;
        for (let i = 0; i < allocationTable.length; i++) {
            for (let j = 0; j < allocationTable[i].length; j++) {
                if (allocationTable[i][j] !== 0) {
                    if (u[i] === null || v[j] === null) {
                        filled = false;
                        updateUV();
                    }
                }
            }
        }
    }

    const deltas = [];
    const deltaTable = Array.from({ length: allocationTable.length }, () => Array(allocationTable[0].length).fill(null));

    for (let i = 0; i < allocationTable.length; i++) {
        for (let j = 0; j < allocationTable[i].length; j++) {
            if (allocationTable[i][j] === 0) {
                deltaTable[i][j] = unitProfits[i][j] - u[i] - v[j];
                deltas.push(deltaTable[i][j]);
            }
        }
    }

    return { deltas, deltaTable };
}

function optimizeAllocation(allocationTable, deltaTable) {
    let maxDelta = -Infinity;
    let pos = { i: -1, j: -1 };

    for (let i = 0; i < deltaTable.length; i++) {
        for (let j = 0; j < deltaTable[i].length; j++) {
            if (deltaTable[i][j] !== null && deltaTable[i][j] > maxDelta) {
                maxDelta = deltaTable[i][j];
                pos = { i, j };
            }
        }
    }

    if (maxDelta <= 0) {
        return allocationTable;
    }

    const path = findSteppingStonePath(allocationTable, pos);

    let minAllocation = Infinity;
    for (let k = 1; k < path.length; k += 2) {
        const { i, j } = path[k];
        minAllocation = Math.min(minAllocation, allocationTable[i][j]);
    }

    for (let k = 0; k < path.length; k++) {
        const { i, j } = path[k];
        if (k % 2 === 0) {
            allocationTable[i][j] += minAllocation;
        } else {
            allocationTable[i][j] -= minAllocation;
        }
    }

    return allocationTable;
}

function findSteppingStonePath(allocationTable, start) {
    const path = [start];
    const { i: startI, j: startJ } = start;
    let i = startI;
    let j = startJ;
    let direction = 'horizontal';

    while (true) {
        if (direction === 'horizontal') {
            let found = false;
            for (let col = 0; col < allocationTable[i].length; col++) {
                if (col !== j && allocationTable[i][col] > 0) {
                    path.push({ i, j: col });
                    j = col;
                    found = true;
                    break;
                }
            }
            if (!found) break;
            direction = 'vertical';
        } else {
            let found = false;
            for (let row = 0; row < allocationTable.length; row++) {
                if (row !== i && allocationTable[row][j] > 0) {
                    path.push({ i: row, j });
                    i = row;
                    found = true;
                    break;
                }
            }
            if (!found) break;
            direction = 'horizontal';
        }
        if (i === startI && j === startJ) break;
    }

    const cycle = [];
    for (let k = 0; k < path.length; k++) {
        const { i, j } = path[k];
        if (k % 2 === 0) {
            cycle.push({ i, j, type: 'positive' });
        } else {
            cycle.push({ i, j, type: 'negative' });
        }
    }

    return cycle;
}

function applyEPerturbation(allocationTable, requiredBaseRoutes) {
    let actualBaseRoutes = allocationTable.flat().filter(value => value > 0).length;

    for (let i = 0; i < allocationTable.length; i++) {
        for (let j = 0; j < allocationTable[i].length; j++) {
            if (allocationTable[i][j] === 0 && actualBaseRoutes < requiredBaseRoutes) {
                allocationTable[i][j] = 1e-6; // e-perturbation
                actualBaseRoutes++;
            }
        }
    }

    return allocationTable;
}

function calculateTotalCost(allocationTable, transportationCosts, purchaseCosts, sellingCost) {
    /***
     Total cost comprises total transportation cost and total purchase cost
     ***/
    let totalCost = 0;

    for (let i = 0; i < allocationTable.length; i++) {
        for (let j = 0; j < allocationTable[i].length; j++) {
            if (transportationCosts[i] && transportationCosts[i][j]) {
                totalCost += allocationTable[i][j] * transportationCosts[i][j];
            }
            if (purchaseCosts[i] && sellingCost[j]) {
                totalCost += allocationTable[i][j] * purchaseCosts[i];
            }
        }
    }

    return totalCost;
}

function calculateTotalRevenue(allocationTable, sellingCosts, purchaseCosts) {
    let totalRevenue = 0;

    for (let i = 0; i < allocationTable.length; i++) {
        if(purchaseCosts[i]) {
            for (let j = 0; j < allocationTable[i].length; j++) {
                if (sellingCosts[j]) {
                    totalRevenue += allocationTable[i][j] * sellingCosts[j];
                }
            }
        }
    }

    return totalRevenue;
}


function calculateTotalProfit(allocationTable, unitProfits) {
    while (unitProfits.length < allocationTable.length) {
        unitProfits.push(new Array(unitProfits[0].length).fill(0));
    }
    for (let i = 0; i < unitProfits.length; i++) {
        while (unitProfits[i].length < allocationTable[0].length) {
            unitProfits[i].push(0);
        }
    }

    let totalProfit = 0;
    for (let i = 0; i < allocationTable.length; i++) {
        for (let j = 0; j < allocationTable[i].length; j++) {
            totalProfit += allocationTable[i][j] * unitProfits[i][j];
        }
    }
    return totalProfit;
}

module.exports = {calculateTotalProfit, calculateTotalRevenue,
    calculateTotalCost, calculateDeltas, calculateUnitProfits,
    getInitialFeasibleSolutionNorthWestCornerMethod, getInitialFeasibleSolutionMaxMatrixElementMethod, getInitialFeasibleSolutionMaxMatrixElementMethodStrict,
    findSteppingStonePath,applyEPerturbation, optimizeAllocation, initializeAllocationTable, }

