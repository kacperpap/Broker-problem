const solveIntermediaryProblem = require('../core.js');

/***
 As described in test case 8
 While adding new test cases, test only intermediaryProfit,
 as this is the goal function that we are maximizing, thus
 different algorithm may find different allocationTables with same profit

 Note: expect(result.allocationTable).toEqual commented below are these which were found by algorithm implemented in core.js
 ***/

describe('solveIntermediaryProblem Tests', () => {
    test('Test Case 1', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2","c3"], [20,30], [10,28,27], [10,12], [30,25,30], [[8,14,17],[12,9,19]]);
        // expect(result.allocationTable).toEqual([[10,0,10,0],[0,28,0,2],[0,0,17,48]]);
        expect(result.intermediaryProfit).toBe(262);
    });

    test('Test Case 2', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2","c3"], [20,40], [16,12,24], [7,8], [18,16,15], [[4,7,2],[8,10,4]]);
        // expect(result.allocationTable).toEqual([[16,0,4,0],[0,0,20,20],[0,12,0,40]]);
        expect(result.intermediaryProfit).toBe(196);
    });

    test('Test Case 3', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [45,25], [30,30], [6,7], [12,13], [[7,4],[3,5]]);
        // expect(result.allocationTable).toEqual([[0,30,15],[25,0,0],[5,0,55]]);
        expect(result.intermediaryProfit).toBe(140);
    });

    test('Test Case 4', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2","c3"], [40,25], [30,15,15], [18,20], [23,21,25], [[2,3,5],[2,3,4]]);
        // expect(result.allocationTable).toEqual([[30,0,10,0],[0,0,5,20],[0,15,0,45]]);
        expect(result.intermediaryProfit).toBe(115);
    });

    test('Test Case 5', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [35,25], [20,30], [6,7], [11,13], [[6,4],[2,5]]);
        // expect(result.allocationTable).toEqual([[0,30,5],[20,0,5],[0,0,50]]); // or [[0,30,0],[20,0,10],[0,0,50]]
        expect(result.intermediaryProfit).toBe(130);
    });

    test('Test Case 6', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [20,20], [16,14], [6,9], [15,14], [[5,3],[9,2]]);
        // expect(result.allocationTable).toEqual([[16,4,0],[0,10,10],[0,0,30]]);
        expect(result.intermediaryProfit).toBe(114);
    });


    // Does not end (zad 6)
    test('Test Case 7', () => {
        const result = solveIntermediaryProblem(["s1","s2", "s3"], ["c1","c2", "c3"], [20,30,55], [28,37,45], [10,12,14], [30,30,25], [[17,15,6],[7,7,1],[15,14,3]]);
        expect(result.intermediaryProfit).toBe(810);
    });

    /***
     zad 8
     In our algorithm optimization ends when all delta are non-positive,
     in this example there is delta that equal 0 in last step,
     continuing algorithm changes routes but not intermediaryProfit, thus both results shown below are well:
     [[0,0,20],[6,14,0],[10,0,20]] -> with deltas all negative
     [[0,10,10],[16,4,0],[0,0,30]] -> with deltas all noo-positive
     ***/
    test('Test Case 8', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [20,20], [16,14], [11,8], [17,16], [[11,4],[7,5]]);
        expect(result.intermediaryProfit).toBe(54);
    });

    //zad 9
    test('Test Case 9', () => {
        const result = solveIntermediaryProblem(["s1","s2"], ["c1","c2"], [20,20], [16,14], [9,6], [14,15], [[2,9],[3,5]]);
        // expect(result.allocationTable).toEqual([[10,0,10],[6,14,0],[0,0,30]]);
        expect(result.intermediaryProfit).toBe(116);
    });

    // zad 10
    test('Test Case 10', () => {
        const result = solveIntermediaryProblem(["s1","s2", "s3"], ["c1","c2", "c3"], [10,17,13], [7,8,11], [12,10,13], [22,20,23], [[3,3,5],[7,7,8],[3,8,6]]);
        expect(result.intermediaryProfit).toBe(139);
    });


    //TODO: e-perturbation case
});
