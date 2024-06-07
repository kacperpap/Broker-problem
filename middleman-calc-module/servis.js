const solveIntermediaryProblem = require("./core.js");
const express = require('express');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())


app.post('/calculate', (req, res) => {
    const { suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts } = req.body;
    const result = solveIntermediaryProblem(suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts);
    if (result.error) {
        res.status(400).json({ error: result.error });
    } else {
        res.json(result);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

