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

// PATCH /rides/:id - Update a ride
app.patch('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: {status: req.body.status} }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({error: "Ride not found"});
        }
        res.status(200).json({ updated: result.modifiedCount });

    } catch (error) {
        res.status(400).json({error: "Invalid ride ID or data"});
    }
});

// DELETE /rides/:id - Delete a ride
app.delete('/rides/:id', async (req, res) => {
    try {
        const result = await db.collection('rides').deleteOne(
            { _id: new ObjectId(req.params.id) }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({error: "Ride not found"});
        }
        res.status(200).json({ deleted: result.deletedCount });

    } catch (error) {
        res.status(400).json({error: "Invalid ride ID"});
    }
});
