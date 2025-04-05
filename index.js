const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // Connect to local MongoDB
const client = new MongoClient(uri);

const drivers = [ 
    {
        name: "Max",  
        vehicleType: "Sedan",
        isAvailable: true,
        rating: 4.8
    },
    {
        name: "Kendryck", 
        vehicleType: "SUV",
        isAvailable: false,
        rating: 4.5
    }
];

drivers.push
({
    name: "Messi",
    vehicleType: "Truck",
    isAvailable: true,
    rating: 4.9
});

console.log(drivers); 
drivers.forEach(drivers => console.log(drivers.name));

async function run() {
    try {
        await client.connect();
        const myDB = client.db("testDB"); 
        const myColl = myDB.collection("drivers");    
        
        const result = await myColl.insertMany(drivers); // Insert all drivers
        console.log(`New drivers created. Count: ${result.insertedCount}`); 
        
        const availableDrivers = await myColl.find({
            isAvailable: true,
            rating: { $gte: 4.5 }
        }).toArray();
        console.log("Available drivers:", availableDrivers);

        const updateResults = await myColl.updateOne(
            { name: "Kendryck" },
            { $inc: { rating: 0.1 } }
        );
        console.log(`Driver updated with result:`, updateResults);

        const deleteResults = await myColl.deleteOne({ isAvailable: false})
        console.log ('Driver deleted with results :', deleteResults);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
        console.log("Database connection closed.");
    }
}

run();




