const {
    calculateDeltas,
    calculateTotalCost, calculateTotalProfit, calculateTotalRevenue, calculateUnitProfits,
    getInitialFeasibleSolutionMaxMatrixElementMethod, getInitialFeasibleSolutionNorthWestCornerMethod, getInitialFeasibleSolutionMaxMatrixElementMethodStrict,
    initializeAllocationTable,
    optimizeAllocation, applyEPerturbation
} = require("./helpers.js")
function solveIntermediaryProblem(suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts) {
    console.log("solveIntermediaryProblem:\n")
    const totalSupply = supply.reduce((acc, val) => acc + val, 0);
    const totalDemand = demand.reduce((acc, val) => acc + val, 0);
    console.log("Total supply:" + totalSupply)
    console.log("Total demand: " + totalDemand)

    let unitProfits = calculateUnitProfits(sellingCosts, purchaseCosts, transportationCosts);
    console.log("Unit Profits:");
    console.log(unitProfits);

    let isBalanced = totalSupply === totalDemand;
    if (isBalanced) {
        console.log("Balanced middleman problem")
    } else {
        console.log("Not-balanced middleman problem, adding fictitious consumer and supplier")

        consumers.push('Fictitious Consumer');
        demand.push(totalSupply);
        unitProfits.forEach(row => row.push(0));

        suppliers.push('Fictitious Supplier');
        supply.push(totalDemand);
        unitProfits.push(new Array(consumers.length).fill(0));

        console.log("Unit Profits with fictitious actors:");
        console.log(unitProfits);
    }

    let allocationTable = initializeAllocationTable(suppliers.length, consumers.length);
    let steps = [];

    // allocationTable = getInitialFeasibleSolutionMaxMatrixElementMethodStrict(supply, demand, unitProfits, allocationTable);
    allocationTable = getInitialFeasibleSolutionMaxMatrixElementMethod(supply, demand, unitProfits, allocationTable, isBalanced)
    // allocationTable = getInitialFeasibleSolutionNorthWestCornerMethod(supply, demand, unitProfits, allocationTable)

    console.log("Initial feasible solution:")
    console.log(allocationTable)

    //TODO: Apply e-perturbation if needed
    const requiredBaseRoutes = suppliers.length + consumers.length - 1;
    const actualBaseRoutes = allocationTable.flat().filter(value => value > 0).length;
    if (actualBaseRoutes < requiredBaseRoutes) {
        allocationTable = applyEPerturbation(allocationTable, requiredBaseRoutes);
    }

    let optimized = false;
    while (!optimized) {
        console.log("Optimizing solution:");
        const { deltas, deltaTable } = calculateDeltas(allocationTable, unitProfits);
        console.log("Calculated deltas (z_ij - u_i - v_j = 0):");
        console.log(deltas);
        console.log("Deltas shown in table - nulls are base routes:");
        console.log(deltaTable);

        let preOptimizationTable = JSON.parse(JSON.stringify(allocationTable));

        if (deltas.every(delta => delta <= 0)) {
            optimized = true;
            console.log("All deltas non-positive -> routes are fully optimized");
        } else {
            console.log("Creating new routes allocations:");
            let newAllocationTable = optimizeAllocation(allocationTable, deltaTable);
            if (newAllocationTable === null) {
                console.log("Optimization ended due to invalid cycle.");
                break;
            }
            if (steps.some(step => JSON.stringify(step.postOptimizationTable) === JSON.stringify(newAllocationTable))) {
                console.log("Optimization ended due to cycle in solutions.");
                break;
            }
            allocationTable = newAllocationTable;
            console.log("New allocation table:");
            console.log(allocationTable);
        }

        let postOptimizationTable = JSON.parse(JSON.stringify(allocationTable));

        steps.push({
            preOptimizationTable,
            postOptimizationTable,
            deltas,
            deltaTable
        });
    }

    let bestStep = steps.reduce((max, step) => step.intermediaryProfit > max.intermediaryProfit ? step : max, steps[0]);
    allocationTable = bestStep.postOptimizationTable;

    const totalCost = calculateTotalCost(allocationTable, transportationCosts, purchaseCosts, sellingCosts);
    console.log("Total cost: " + totalCost)
    const totalRevenue = calculateTotalRevenue(allocationTable, sellingCosts, purchaseCosts);
    console.log("Total revenue: " + totalRevenue)
    const intermediaryProfit = calculateTotalProfit(allocationTable, unitProfits);
    console.log("Intermediary profit: " + intermediaryProfit)

    let allocationTableRealRoutes = allocationTable;
    if (!isBalanced) {
        allocationTableRealRoutes = allocationTable.slice(0, -1).map(row => row.slice(0, -1));
    }

    return { allocationTable, allocationTableRealRoutes, unitProfits, steps, totalCost, totalRevenue, intermediaryProfit };
}

module.exports = solveIntermediaryProblem

const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [13,27], [19,21], [6,9], [13,15], [[3,2],[7,1]]);

