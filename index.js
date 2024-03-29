const express = require('express');
const cors = require('cors')
const app =express();
const port = process.env.PORT || 5000
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpdogwm.mongodb.net/?retryWrites=true&w=majority`;

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

     //database collection

     const userCollection= client.db("jerseyFreakDB").collection("users")
     const productCollection = client.db("jerseyFreakDB").collection("products")
     const cartCollection = client.db("jerseyFreakDB").collection("carts")
     app.post('/users',async(req,res)=>{
      const user= req.body;
      const query={email:user.email}
      const existingUser= await userCollection.findOne(query)
      if(existingUser){
        return res.send({message:'user already exist',insertedId:null})
      }
      const result= await userCollection.insertOne(user)
      res.send(result)
    })

    app.post('/products',async(req,res)=>{
      const product = req.body
      const result= await productCollection.insertOne(product)
      res.send(result)
    })

    app.get('/products/category',async(req,res)=>{
      const productBrand= req.query.category
      console.log(productBrand);
      const query={productBrand: productBrand}
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })

     //single product get from database
   app.get('/singleProduct/:id',async(req,res)=>{
  const id = req.params.id
  const query= {_id: new ObjectId(id)}
  const result =await productCollection.findOne(query)
  res.send(result)
})


 app.patch('/updateProduct/:id',async(req,res)=>{
  try{
    const id= req.params.id
    const query = {_id: new ObjectId(id)}

    const dataToUpdate ={
      productName: req.body.productName,
      
      productionPrice: req.body.productionPrice,
 
    
      productPrice:req.body.productPrice ,
       
      productDetails: req.body.productDetails,
    
      productDetails: req.body.productDetails,
      productRating: req.body.productRating,
      productType: req.body.productType,
      email: req.body.email,
    }

    const updateDoc = {
      $set: dataToUpdate,
    };

    const result = await productCollection.updateOne(query, updateDoc);
  
    res.send(result);

  }catch(error){
    console.error('Error updating badge:', error);
    res.status(500).send('Internal Server Error');
  }
 })


 app.post('/carts',async(req,res)=>{
  const cart = req.body
  const result= await cartCollection.insertOne(cart)
  res.send(result)
})


app.get('/carts', async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email:email };
    
    // Assuming cartCollection is a MongoDB collection
    const result = await cartCollection.find(query).sort({ createdAt: -1 }).toArray();

    res.send(result);
  } catch (error) {
    console.error("Error fetching and sorting carts:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/products',async(req,res)=>{
  const result =await productCollection.find().sort({ createdAt: -1 }).toArray()
  res.send(result)
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











app.get('/',(req,res)=>{
  res.send('jersey freak server is running')
})

app.listen(port,()=>{
  console.log(`server is running on PORT: ${port}`);
})
