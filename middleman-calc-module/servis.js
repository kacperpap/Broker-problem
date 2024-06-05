import {solveIntermediaryProblem} from "./core.js";
import express from 'express';

const app = express();
app.use(express.json());

app.post('/calculate', (req, res) => {
    const { suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts } = req.body;
    const result = solveIntermediaryProblem(suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts);
    res.json(result);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

