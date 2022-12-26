const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnl5op5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

   try {

      const categoriesCollection = client.db('news-71').collection('categories');
      const newsesCollection = client.db('news-71').collection('news');
      const usersCollection = client.db('news-71').collection('users');


      app.get('/', (req, res) => {
         res.send('The news-71 server is running ')
      })

      app.get('/allcategories', async (req, res) => {
         const query = {}
         const result = await categoriesCollection.find(query).toArray()
         res.send(result)
      })

      //Saifullah write code here

      app.get('/latestnews', async (req, res) => {

         const result = await (newsesCollection.find({}).limit(6)).toArray();
         res.send(result);
      })
      app.get('/users', async (req, res) => {
         const query = {}
         const users = await usersCollection.find(query).toArray()
         res.send(users)
      })

      app.get('/users/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: ObjectId(id) }
         const user = await usersCollection.findOne(query)
         res.send(user)
      })

      app.put('/users/update/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) }
         const option = { upsert: true }
         const updatedDoc = {
            $set: {
               role: 'admin'
            }
         }
         const result = await usersCollection.updateOne(filter, updatedDoc, option);
         res.send(result)
      })

      app.delete('/users/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) }
         const result = await usersCollection.deleteOne(filter)
         res.send(result)
      })

      //Mostafa write code here

      app.post('/adduser', async (req, res) => {
         const user = req.body;
         // console.log(user);
         const result = await usersCollection.insertOne(user);
         res.send(result);
     });

      //  get category wised data
      app.get('/news/:name', async (req, res) => {
         const length = parseInt(req.query.length);
         console.log(length);
         const name = req.params.name;
         const result = await (newsesCollection.find({ category_id: name }).limit(length)).toArray();
         console.log(result);
         res.send(result);
      })
      //Inzamam write code here .


      // Mehadi write code here
      // add news 
      app.post('/addnews', async (req, res) => {
         const newsData = req.body;
         const result = await newsesCollection.insertOne(newsData);
         res.send(result);
      })
   }
   finally { }
}
run().catch(error => console.error(error));

app.listen(port, () => {
   console.log(`News-71 server is running on ${port}`);
})