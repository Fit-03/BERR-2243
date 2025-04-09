const express = require('express');
const { MongoClient } = require('mongodb');
const port = 3000;

const app = express();
app.use(express.json());

let db;

async function connecToMongoDB() {
    const uri = 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        db = client.db('testDB');
    } catch (error) {
        console.error('Error:', error);
    }
}
connecToMongoDB();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// GET /rides - Fetch all rides
app.get('/rides', async (req, res) => {
    try {
        const rides = await db.collection('rides').find().toArray();
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch rides"});
    }
});

// POST /rides - Create a new ride
app.post('/rides', async (req, res) => {
    try {
        const result = await db.collection('rides').insertOne(req.body);
        res.status(201).json({ id: result.insertedId});
    } catch (error) {
        res.status(500).json({error: "Invalid ride data"});
    }
});