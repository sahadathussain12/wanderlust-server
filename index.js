const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("wanderlust");
    const destinationsCollection = db.collection("destinations");

    app.get("/destinations", async (req, res) => {
      const destination = await destinationsCollection.find().toArray();
      res.send(destination);
    });

    app.post("/destinations", (req, res) => {
      const destinationsData = req.body;
      console.log(destinationsData);
      const result = destinationsCollection.insertOne(destinationsData);
      res.send(result);
    });

   app.get("/destinations/:id", async (req, res) => {
  const { id } = req.params;

   console.log(id, "destination id");

   const result = await destinationsCollection.findOne({ _id: new ObjectId(id) });

  res.send(result);
});

   app.patch("/destinations/:id", async(req, res)=> {
    const {id} = req.params;
    const updateData = req.body;
    const result = await destinationsCollection.updateOne(
      {_id: new ObjectId(id)},
      {$set: updateData}
    )
    res.send(result)
   })
   app.delete("/destinations/:id", async ( req, res)=>{
    const {id} = req.params;
    const result = await destinationsCollection.deleteOne({_id: new ObjectId(id)});
    res.send(result)
   })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
