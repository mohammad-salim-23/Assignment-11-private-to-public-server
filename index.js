
// const express = require('express')
// const cors = require("cors");
// require("dotenv").config();
// const cookieParser = require('cookie-parser')
// const jwt = require('jsonwebtoken');
// const app = express()
// const port = process.env.PORT||5000;
// // middleware
// app.use(cors({
//   origin:[
//     'http://localhost:5173',
//     "https://assignment-11-client-1d064.web.app",
//     "https://assignment-11-client-1d064.firebaseapp.com"
//   ],
//   credentials:true,
// }));
// const cookieOptions = {
  
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production"?true:false,
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  
// };
// // my handmade middleware
// const logger = (req,res,next)=>{
//   console.log("log info.......",req.method,req.url);
//   next();
// }
// const verifyToken=(req,res,next)=>{
//   const token = req?.cookies?.token;
//   if(!token){
//         return res.status(401).send({message:'unAuthorized access'})
//   }
//   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
//     if(err){
//       return res.status(401).send({message:'unauthorized access'})
//     }
//     req.user = decoded;
//     next();
//   })
// }
// app.use(express.json());
// app.use(cookieParser());
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipsrkdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     const foodsCollection = client.db("foodsDB").collection("foods");
//     const orderCollections = client.db("foodsDB").collection("purchase");
//     const galleryCollection = client.db("foodsDB").collection("gallery");

//     // auth related api
//     app.post('/jwt',logger,async(req,res)=>{
//       const user = req.body;
//       console.log('user for token',user);
//       const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
//         res
//         .cookie('token',token,cookieOptions)
//         .send({success:true})
      
//     })
//     app.post('/logout',async(req,res)=>{
//       const user = req.body;
//       console.log('logging out',user);
//       res.clearCookie('token',{...cookieOptions,maxAge:'0'})
//       .send({success:true})
//     })
//     // post gallery data
//     app.post("/feedback",async(req,res)=>{
//       const newFeedback = req.body;
//       const result = await galleryCollection.insertOne(newFeedback);
//       res.send(result);
//     })
//     app.get("/feedback",async(req,res)=>{
//       const cursor = galleryCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })
//     //  customer buy data
//     app.post("/purchase", async (req, res) => {
//       try {
//           const id = req.params.id;
//           const newOrder = req.body;
//           console.log(newOrder);
//         // update the food quantity
//         const foodQuery = {_id:(id)};
//         const food = await foodsCollection.findOne(foodQuery);
//         const updatedFoodQuantity = food.quantity - newOrder.quantity;
//         const updatedPurchaseQuantity =parseInt( food.
//           purchaseQuantity)+parseInt(newOrder.quantity);
//         await foodsCollection.updateOne(foodQuery,
//           {
//             $set:
//             {
//               quantity:updatedFoodQuantity,
//               purchaseQuantity:updatedPurchaseQuantity
//          }})
        
//           newOrder = req.body;
//           const result = await orderCollections.insertOne(newOrder);
//           res.send(result); 
//       } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: 'Internal Server Error' });
//       }
//   });
//   // add new food item in foodsCollection
//   app.post("/food",async(req,res)=>{
//     const newFood = req.body;
//     const result = await foodsCollection.insertOne(newFood);
//     res.send(result);
//   })
    
//     app.get("/food",async(req,res)=>{
//       const cursor = foodsCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })
//     app.get("/food/:id",async(req,res)=>{
//       try{
//         const id = req.params.id;
//       const query = {_id:new ObjectId(id)};
//       const result = await foodsCollection.findOne(query);
//       res.send(result);
//       }
//       catch(error){
//         console.log(error);
//       }
//     })
//     app.get("/myfood/:email",verifyToken,async(req,res)=>{
//       const cursor = foodsCollection.find({email:req.params.email});
//       console.log(req.user);
//       const result = await cursor.toArray();
//       res.send(result);
//     })
//     // get my purchase collection
//     app.get("/purchase",async(req,res)=>{
//       const cursor = orderCollections.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     })
//     app.get("/myPurchase/:email",async(req,res)=>{
//        const cursor = orderCollections.find({email:req.params.email});
//        const result = await cursor.toArray();
//        res.send(result);
//     })
//     // update foodCollections data
//     app.put("/food/:id",async(req,res)=>{
//       const id = req.params.id;
//       const filter = {_id:new ObjectId(id)};
//       const options = {upsert:true};
//       const updateFood = req.body;
      
//       const Food = {
//         $set:{
//           name:updateFood.name,
//           image:updateFood.image,
//           price:updateFood.price,
//           category:updateFood.category,
//           made_by:updateFood.made_by,
//           origin:updateFood.origin,
//           quantity:updateFood.quantity,
//           description:updateFood.description,

//         }
//       };

//       const result = await foodsCollection.updateOne(filter,Food,options);
//       res.send(result);

//     })
//     app.get("/purchase/:id",async(req,res)=>{
//       try{
//         const id = req.params.id;
//         console.log(id);
//         const query = {_id:new ObjectId(id)};
//         const result = await orderCollections.findOne(query);
//         res.send(result);
//       }
//       catch(error){
//         console.log(error);
//       }
//     })
//     app.delete("/purchase/:id",async(req,res)=>{
//       try{
//         const id = req.params.id;
//       const query = {_id:id};
//       const result = await orderCollections.deleteOne(query);
//       res.send(result);
//       }
//       catch(error){
//         res.status(500).json({error:"Internal Server Error"})
//       }
//     })
    
//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send('Hello Boss!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express')
const cors = require("cors");
require("dotenv").config();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT||5000;
// middleware
app.use(cors({
  origin:[
    'http://localhost:5173',
    "https://assignment-11-client-1d064.web.app",
    "https://assignment-11-client-1d064.firebaseapp.com"
  ],
  credentials:true,
}));
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};
// my handmade middleware
const logger = (req,res,next)=>{
  console.log("log info.......",req.method,req.url);
  next();
}
const verifyToken=(req,res,next)=>{
  const token = req?.cookies?.token;
  if(!token){
        return res.status(401).send({message:'unAuthorized access'})
  }
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    if(err){
      return res.status(401).send({message:'unauthorized access'})
    }
    req.user = decoded;
    next();
  })
}
app.use(express.json());
app.use(cookieParser());
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
    // await client.connect();
    const foodsCollection = client.db("foodsDB").collection("foods");
    const orderCollections = client.db("foodsDB").collection("purchase");
    const galleryCollection = client.db("foodsDB").collection("gallery");

    // auth related api
    app.post('/jwt',logger,async(req,res)=>{
      const user = req.body;
      console.log('user for token',user);
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
        res
        .cookie('token',token,{
          httpOnly:true,
          secure:true,
          sameSite:'none'
        })
        .send({success:true})
      
    })
    app.post('/logout',async(req,res)=>{
      const user = req.body;
      console.log('logging out',user);
      res.clearCookie('token',{maxAge:'0'})
      .send({success:true})
    })
    // post gallery data
    app.post("/feedback",async(req,res)=>{
      const newFeedback = req.body;
      const result = await galleryCollection.insertOne(newFeedback);
      res.send(result);
    })
    app.get("/feedback",async(req,res)=>{
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //  customer buy data
    app.post("/purchase/:id", async (req, res) => {
      try {
          const id = req.params.id;
          const newOrder = req.body;
        // update the food quantity
        const foodQuery = {_id:new ObjectId(id)};
        const food = await foodsCollection.findOne(foodQuery);
        const updatedFoodQuantity = food.quantity - newOrder.quantity;
        const updatedPurchaseQuantity =parseInt( food.
          purchaseQuantity)+parseInt(newOrder.quantity);
        await foodsCollection.updateOne(foodQuery,
          {
            $set:
            {
              quantity:updatedFoodQuantity,
              purchaseQuantity:updatedPurchaseQuantity
         }})
        
          // newOrder._id = id;
          const result = await orderCollections.insertOne(newOrder);
          res.send(result); 
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  // add new food item in foodsCollection
  app.post("/food",async(req,res)=>{
    const newFood = req.body;
    const result = await foodsCollection.insertOne(newFood);
    res.send(result);
  })
    
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
    app.get("/myfood/:email",verifyToken,async(req,res)=>{
      const cursor = foodsCollection.find({email:req.params.email});
      console.log(req.user);
      const result = await cursor.toArray();
      res.send(result);
    })
    // get my purchase collection
    app.get("/purchase",verifyToken,async(req,res)=>{
      const cursor = orderCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get("/myPurchase/:email",async(req,res)=>{
       const cursor = orderCollections.find({email:req.params.email});
       const result = await cursor.toArray();
       res.send(result);
    })
    // update foodCollections data
    app.put("/food/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const options = {upsert:true};
      const updateFood = req.body;
      
      const Food = {
        $set:{
          name:updateFood.name,
          image:updateFood.image,
          price:updateFood.price,
          category:updateFood.category,
          made_by:updateFood.made_by,
          origin:updateFood.origin,
          quantity:updateFood.quantity,
          description:updateFood.description,

        }
      };

      const result = await foodsCollection.updateOne(filter,Food,options);
      res.send(result);

    })
    app.get("/purchase/:id",async(req,res)=>{
      try{
        const id = req.params.id;
        console.log(id);
        const query = {_id:new ObjectId(id)};
        const result = await orderCollections.findOne(query);
        res.send(result);
      }
      catch(error){
        console.log(error);
      }
    })
    app.delete("/purchase/:id",async(req,res)=>{
      try{
        const id = req.params.id;
      const query = {_id:id};
      const result = await orderCollections.deleteOne(query);
      res.send(result);
      }
      catch(error){
        res.status(500).json({error:"Internal Server Error"})
      }
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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