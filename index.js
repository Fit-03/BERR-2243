// This is week 2 exercise
const {MongoClient} = require('mongodb');

const drivers = [
    {
        name: "John Doe",
        vehicleType: "Sedan",
        isAvailable: true,
        rating: 4.8,
    },
    {
        name: "Alice Smith",
        vehicleType: "SUV",
        isAvailable: false,
        rating: 4.5,
    }
];

// Show the data in the console
console.log(drivers);

// Show the all the drivers name in the console
drivers.forEach(driver => {console.log(driver.name);});

// Add additional driver to the drivers array
drivers.push({
    name: "Bob Johnson",
    vehicleType: "Truck",
    isAvailable: true,
    rating: 4.7,
});

async function main() {
    const uri = "mongodb://localhost:27017/"
    const client = new MongoClient(uri);
    
    // This is to perform insertion of the drivers array into MongoDB (Create)
    // The database name is testDB and the collection name is drivers
    try {
        await client.connect();
        const db = client.db('testDB');

        const driversCollection = db.collection('drivers');
        
        // Async function cannot use forEach, so I use for..of loop instead
        for (const driver of drivers) {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with result: ${result.insertedId}`);
        };

        // This is to perform the update operation (Update)
        const updateResult = await db.collection('drivers').updateOne(
            { name: "John Doe" },
            { $inc: { rating: 0.1 } }
        );
        console.log(`Driver updated with result: ${updateResult}`);

        // This is to perform the read operation (Read)
        const availableDrivers = await db.collection('drivers').find({
            isAvailable: true,
            rating: { $gte: 4.5 }
        }).toArray();
        console.log("Available drivers: ", availableDrivers);
    }
    catch(err) {
        console.error("Error:", err);
    }

    finally {
        await client.close();
    }
}

main();