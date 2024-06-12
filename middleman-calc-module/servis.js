const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const solveIntermediaryProblem = require('./core.js');

app.post('/calculate', async (req, res) => {
    const { suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts } = req.body;
    const result = solveIntermediaryProblem(suppliers, consumers, supply, demand, purchaseCosts, sellingCosts, transportationCosts);

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    try {
        const dbResult = await prisma.result.create({
            data: {
                suppliers,
                consumers,
                supply,
                demand,
                purchaseCosts,
                sellingCosts,
                transportationCosts,
                allocationTable: result.allocationTable,
                totalCost: result.totalCost,
                totalRevenue: result.totalRevenue,
                intermediaryProfit: result.intermediaryProfit,
            }
        });
        return res.json(dbResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error saving result to database' });
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await prisma.result.findMany();
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching results' });
    }
});

app.get('/results/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.result.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!result) {
            return res.status(404).json({ error: 'Result not found' });
        }
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching result' });
    }
});

app.get('/results/before/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const results = await prisma.result.findMany({
            where: {
                createdAt: {
                    lt: new Date(date),
                },
            },
        });
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching results' });
    }
});

app.get('/results/after/:date', async (req, res) => {
    const { date } = req.params;
    try {
        const results = await prisma.result.findMany({
            where: {
                createdAt: {
                    gt: new Date(date),
                },
            },
        });
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error fetching results' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
