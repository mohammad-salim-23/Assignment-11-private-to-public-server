const express = require('express')
const cors = require("cors");
require("dotenv").config();
const app = express()
const port = process.env.PORT||5000;
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipsrkdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const foodsCollection = client.db("foodsDB").collection("foods");
    const orderCollections = client.db("foodsDB").collection("purchase");
    //  customer buy data
    app.post("/food/:id", async (req, res) => {
      try {
          const id = req.params.id;
          const newOrder = req.body;
        // update the food quantity
        const foodQuery = {_id:new ObjectId(id)};
        const food = await foodsCollection.findOne(foodQuery);
        const updatedFoodQuantity = food.quantity - newOrder.quantity;
        const updatedPurchaseQuantity = food.
        purchaseQuantity+newOrder.quantity;
        await foodsCollection.updateOne(foodQuery,
          {
            $set:
            {
              quantity:updatedFoodQuantity,
              purchaseQuantity:updatedPurchaseQuantity
         }})
        
          newOrder._id = id;
          const result = await orderCollections.insertOne(newOrder);
          res.send(result); 
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
    app.get("/food",async(req,res)=>{
      const cursor = foodsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get("/food/:id",async(req,res)=>{
      try{
        const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await foodsCollection.findOne(query);
      res.send(result);
      }
      catch(error){
        console.log(error);
      }
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Boss!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})