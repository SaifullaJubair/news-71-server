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

      //Mostafa write code here

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