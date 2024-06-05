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

    allocationTable = getInitialFeasibleSolutionMaxMatrixElementMethod(supply, demand, unitProfits, allocationTable);

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
        console.log("Optimizing solution:")
        const { deltas, deltaTable } = calculateDeltas(allocationTable, unitProfits);
        console.log("Calculated deltas (z_ij - u_i - v_j = 0):")
        console.log(deltas)
        console.log("Deltas shown in table - nulls are base routes")
        console.log(deltaTable)

        let preOptimizationTable = JSON.parse(JSON.stringify(allocationTable)); // Clone the table before optimization

        if (deltas.every(delta => delta <= 0)) {
            optimized = true;
            console.log("All deltas non-positive -> routes are fully optimized")
        } else {
            console.log("Creating new routes allocations:")
            allocationTable = optimizeAllocation(allocationTable, deltaTable);
            console.log("New allocation table:")
            console.log(allocationTable)
        }

        let postOptimizationTable = JSON.parse(JSON.stringify(allocationTable)); // Clone the table after optimization

        steps.push({
            preOptimizationTable,
            postOptimizationTable,
            deltas,
            deltaTable
        });
    }

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

solveIntermediaryProblem(["s1","s2"], ["c1","c2","c3"], [20,30], [10,28,27], [10,12], [30,25,30], [[8,14,17],[12,9,19]]);

module.exports = solveIntermediaryProblem


