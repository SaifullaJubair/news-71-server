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

      const categoriesCollection = client.db('news-71').collection('categories')
      const newsCollection = client.db('news-71').collection('news')


      app.get('/', (req, res) => {
         res.send('The news-71 server is running ')
      })

      app.get('/allcategories', async (req, res) => {
         const query = {}
         const result = await categoriesCollection.find(query).toArray()
         res.send(result)
      })

      //Saifullah write code here


      //Mostafa write code here
      
      app.post('/news/:id', async (req, res) => {
         const user = req.body;
         // console.log(user);
         const result = await newsCollection.insertOne(user);
         res.send(result);
     });

      //Inzamam write code here

      // Mehadi write code here



   }
   finally { }
}
run().catch(error => console.error(error));

app.listen(port, () => {
   console.log(`genius car server is running on ${port}`);
})