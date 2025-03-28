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
    
    try {
        await client.connect();
        const db = client.db('testDB');

        const driversCollection = db.collection('drivers');
        
        drivers.forEach(async (driver) => {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with result: ${result}`);
        });
    }
    finally {
        await client.close();
    }
}