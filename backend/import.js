const { MongoClient } = require('mongodb');
const fs = require('fs');

// MongoDB connection URI
const uri = "mongodb+srv://raresstancu:NASUS321@proiectbd.kmjscrk.mongodb.net/?retryWrites=true&w=majority";

// JSON file path
const jsonFilePath = "C:\\Users\\Rares\\Desktop\\bd proiect\\carti.json";

// Collection name
const collectionName = "Biblioteca";

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  // Parse JSON data
  const books = JSON.parse(data);

  // Connect to MongoDB
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      const db = client.db();
      const collection = db.collection(collectionName);

      // Insert data into the collection
      return collection.insertMany(books);
    })
    .then(result => {
      console.log(`Successfully imported ${result.insertedCount} documents into the collection.`);
    })
    .catch(err => {
      console.error('Error inserting documents:', err);
    });
});
