const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://raresstancu:parola123@proiectbd.kmjscrk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDB();

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/api/Biblioteca', async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('Biblioteca');
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/Biblioteca', async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('Biblioteca');
    const newData = req.body;
    const result = await collection.insertOne(newData);

    res.json({ message: 'Documentul a fost adaugat cu succes', documentId: result.insertedId });
  } catch (error) {
    console.error('Eroare in procesul de adaugare a documentului:', error);
    res.status(500).json({ error: 'Eroare in procesul de adaugare a documentului' });
  }
});

app.patch('/api/Biblioteca/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db('test');
    const collection = db.collection('Biblioteca');
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Niciun câmp de actualizat' });
    }

    const result = await collection.updateOne({ id: parseInt(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Documentul nu a fost găsit' });
    }

    res.status(200).json({ message: 'Documentul a fost actualizat cu succes' });
  } catch (error) {
    console.error('Eroare actualizare document:', error);
    res.status(500).json({ error: 'Eroare internă a serverului' });
  }
});

app.delete('/api/Biblioteca/:id', async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('Biblioteca');

    const id = parseInt(req.params.id); 

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalid' });
    }

    const result = await collection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Documentul nu a fost găsit' });
    }

    res.json({ message: 'Document șters cu succes' });
  } catch (error) {
    console.error('Eroare în procesul de ștergere a documentului:', error);
    res.status(500).json({ error: 'Eroare în procesul de ștergere a documentului' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
