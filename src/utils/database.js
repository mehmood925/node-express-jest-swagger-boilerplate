const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://beta-user:cr1vVwuAhX1unaJK@cluster0.c1tbi1c.mongodb.net/test";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('dnotifier');
    const collection = database.collection('contracts');
    const query = { title: 'Back to the Future' };
    
    // Example: Finding one document that matches the query
    const result = await collection.findOne(query);
    console.log(result);
  } finally {
    // Ensure the client is closed when the operation is complete
    await client.close();
  }
}

run().catch(console.dir);