function initializeAllocationTable(rows, cols) {
    return Array.from({length: rows}, () => Array(cols).fill(0));
}


function getInitialFeasibleSolutionMaxMatrixElementMethod(supply, demand, unitProfits, allocationTable, isBalanced) {
    let remainingSupply = [...supply];
    let remainingDemand = [...demand];

    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        let maxProfit = -Infinity;
        let maxRow = -1;
        let maxCol = -1;

        /***
         Number(!isBalanced) excludes fictitious supplier and consumer if exists
         ***/
        for (let i = 0; i < unitProfits.length - Number(!isBalanced); i++) {
            for (let j = 0; j < unitProfits[i].length - Number(!isBalanced); j++) {
                if (remainingSupply[i] > 0 && remainingDemand[j] > 0 && unitProfits[i][j] > maxProfit) {
                    maxProfit = unitProfits[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }

        if (maxRow === -1 || maxCol === -1) break;

        let allocation = Math.min(remainingSupply[maxRow], remainingDemand[maxCol]);
        allocationTable[maxRow][maxCol] = allocation;
        remainingSupply[maxRow] -= allocation;
        remainingDemand[maxCol] -= allocation;
    }

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

        if (maxRow === -1 || maxCol === -1) break;

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

        if (maxRow === -1 || maxCol === -1) break;

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
    let i = 0;
    let j = 0;

    while (remainingSupply.some(s => s > 0) && remainingDemand.some(d => d > 0)) {
        if (remainingSupply[i] > 0 && remainingDemand[j] > 0) {
            let allocation = Math.min(remainingSupply[i], remainingDemand[j]);
            allocationTable[i][j] = allocation;
            remainingSupply[i] -= allocation;
            remainingDemand[j] -= allocation;
        }

        if (remainingSupply[i] === 0) i++;
        if (remainingDemand[j] === 0) j++;
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

/***
 While pos at the input to findSteppingStonePath is the position in deltas table of maximum non-base indicator (delta),
 positions in path are cycle comprised of elements in negative and positive half-cycles. First positive pos is the pos from input,
 next founded in path belongs to negative cycle, next to positive and so on. Therefore, looping from second element in path, loops
 only through negative cycle, and finds there minimum value, which then needs to be added to positive cycle elements (allocationRoutes),
 and subtracted from negative cycle elements (allocationRoutes)
 ***/

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

    const { cycle, valid } = findSteppingStonePath(allocationTable, pos);

    if (!valid) {
        console.error("Invalid cycle found!");
        return allocationTable;
    }

    let minAllocation = Infinity;
    for (let k = 1; k < cycle.length; k += 2) {
        const { i, j } = cycle[k];
        minAllocation = Math.min(minAllocation, allocationTable[i][j]);
    }

    for (let k = 0; k < cycle.length; k++) {
        const { i, j } = cycle[k];
        if (k % 2 === 0) {
            allocationTable[i][j] += minAllocation;
        } else {
            allocationTable[i][j] -= minAllocation;
        }
    }

    return allocationTable;
}

function findSteppingStonePath(allocationTable, pos) {
    const cycle = [];
    const rows = allocationTable.length;
    const cols = allocationTable[0].length;

    function isBasicVariable(i, j) {
        return allocationTable[i][j] > 0;
    }

    cycle.push({ i: pos.i, j: pos.j, type: 'positive' });

    const tempValue = allocationTable[pos.i][pos.j];
    allocationTable[pos.i][pos.j] = 1;

    function searchNextElement(current, direction, excluded) {
        const { i, j } = current;
        if (direction === 'horizontal') {
            for (let jj = 0; jj < cols; jj++) {
                if (jj !== j && isBasicVariable(i, jj) && !(excluded && excluded.i === i && excluded.j === jj)) {
                    return { i, j: jj };
                }
            }
        } else if (direction === 'vertical') {
            for (let ii = 0; ii < rows; ii++) {
                if (ii !== i && isBasicVariable(ii, j) && !(excluded && excluded.i === ii && excluded.j === j)) {
                    return { i: ii, j };
                }
            }
        }
        return null;
    }

    let current = { i: pos.i, j: pos.j };
    let direction = 'horizontal';
    let type = 'negative';
    let excluded = null;

    while (true) {
        let nextElement = searchNextElement(current, direction, excluded);
        if (!nextElement) {
            /***
             Backtrack: remove the last element and try a different path
             We are looking for next elements step by step, that is why
             we can find the element that does not have its next element,
             and also is not the ending point (starting point), so we need
             to remove it and search for another option excluding this one
             element in current iteration, so a new one can be found
             ***/
            excluded = cycle.pop();
            if (cycle.length === 0) break;
            current = cycle[cycle.length - 1];
            direction = direction === 'horizontal' ? 'vertical' : 'horizontal';
            type = cycle.length % 2 === 0 ? 'positive' : 'negative';
            continue;
        }

        if (nextElement.i === pos.i && nextElement.j === pos.j) {
            break;
        }

        excluded = null;
        nextElement.type = type;
        cycle.push(nextElement);

        current = nextElement;
        direction = direction === 'horizontal' ? 'vertical' : 'horizontal';
        type = cycle.length % 2 === 0 ? 'positive' : 'negative';
    }

    allocationTable[pos.i][pos.j] = tempValue;

    if (validateCycle(cycle,allocationTable) && validateSupplyDemand(allocationTable,cycle)) {
        return { cycle, valid: true };
    } else {
        return { cycle, valid: false };
    }
}

function validateCycle(cycle, allocationTable) {
    if (cycle.length < 4) {
        return false;
    }

    const rowCounts = new Array(allocationTable.length).fill(0);
    const colCounts = new Array(allocationTable[0].length).fill(0);

    for (const { i, j } of cycle) {
        rowCounts[i]++;
        colCounts[j]++;
    }

    for (const count of rowCounts.concat(colCounts)) {
        if (count !== 0 && count !== 2) {
            return false;
        }
    }

    return true;
}

function validateSupplyDemand(allocationTable, cycle) {
    const rowSums = new Array(allocationTable.length).fill(0);
    const colSums = new Array(allocationTable[0].length).fill(0);

    cycle.forEach(({ i, j, type }) => {
        const value = type === 'positive' ? 1 : -1;
        rowSums[i] += value;
        colSums[j] += value;
    });

    return rowSums.every(sum => sum === 0) && colSums.every(sum => sum === 0);
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

