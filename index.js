const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ovmmvr6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const bookingCollection = client.db("jerinsParlour").collection("bookings");
    const serviceCollection = client.db("jerinsParlour").collection("services");
    const reviewCollection = client.db("jerinsParlour").collection("reviews");
    const userCollection = client.db("jerinsParlour").collection("users");

    // booking api's
    app.get('/bookings', async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result)
    });
    app.post('/bookings', async (req, res) => {
      const bookings = req.body;
      bookings.status = "pending";
      const result = await bookingCollection.insertOne(bookings);
      res.send(result)
    });

    // services api
    app.get('/services', async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });
    // review api
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)

    });

    // users api
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });


    app.post('/users', async (req, res) => {
      const newUser = req.body.email;
      const existingUser = await userCollection.findOne({ email: newUser });
 
      if (!existingUser) {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      } 
    });









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello jerins!!');
});

app.listen(port, () => {
  console.log(`Jerin's parlour listening on port ${port}`);
});
