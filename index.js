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
      const commentCollection = client.db('news-71').collection('comment');


      app.get('/', (req, res) => {
         res.send('The news-71 server is running ')
      })

      app.get('/allcategories', async (req, res) => {
         const result = await categoriesCollection.find({}).toArray()
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

      //************Mostafa write code here ********************************
      //************Mostafa write code here ********************************
      //************Mostafa write code here ********************************
      //************Mostafa write code here ********************************
      //************Mostafa write code here ********************************

      app.post('/adduser', async (req, res) => {
         const user = req.body;
         // console.log(user);
         const result = await usersCollection.insertOne(user);
         res.send(result);
      });


      app.get('/news', async (req, res) => {
         const query = {}
         const users = await newsesCollection.find(query).toArray()
         res.send(users)
      })

      app.get('/singlenews/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const news = await newsesCollection.findOne(query);
         res.send(news);
      })
      app.get('/newsCategory/:id', async (req, res) => {
         const id = req.params.id;
         const query = { category_id: id };
         const cursor = newsesCollection.find(query).limit(4);
         const news = await cursor.sort({ createdAt: -1 }).toArray();
         res.send(news)
      })
      app.post('/addcomment', async (req, res) => {
         const comment = req.body;
         // console.log(comment);
         const result = await commentCollection.insertOne(comment);
         res.send(result);
      });

      app.get('/comment/:id', async (req, res) => {
         const id = req.params.id;
     
         const query = { newsId: id };
         const cursor = commentCollection.find(query).limit(10);
         const news = await cursor.sort({ createdAt: -1 }).toArray();
         res.send(news)
      })











      //  get category wised data
      app.get('/news/:name', async (req, res) => {
         const length = parseInt(req.query.length);
         const name = req.params.name;
         if (length == -1) {
            const result = await (newsesCollection.find({ category_id: name })).toArray();
            res.send(result);
         }
         else {
            const result = await (newsesCollection.find({ category_id: name }).limit(length)).toArray();
            res.send(result);
         }

         const result = await (newsesCollection.find({ category_id: name }).limit(length)).sort({ createdAt: -1 }).toArray();
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
      app.post('/addcategory', async (req, res) => {
         const name = req.body.name
         const data = {
            name: name
         }
         const result = await categoriesCollection.insertOne(data);
         res.send(result);

      })

      app.get('/allnews/:categoryName', async (req, res) => {
         const name = req.params.categoryName;
         if (name === 'All') {
            const result = await newsesCollection.find({}).toArray();
            res.send(result);
         }
         else {
            const result = await newsesCollection.find({ category_id: name }).toArray()
            res.send(result);
         }

      })

      app.get('/getnews', async (req, res) => {

         const id = req.query.id;
         console.log('id', id)
         const result = await newsesCollection.findOne({ _id: ObjectId(id) });
         res.send(result)
      })

      app.put('/editnews/:id', async (req, res) => {
         const id = req.params.id;
         const data = req.body;
         const filter = { _id: ObjectId(id) }
         const option = { upsert: true }
         const updatedDoc = {
            $set: {
               heading: data?.heading,
               details: data?.details,
               location: data?.location,
               img: data?.img,
               category_id: data?.category_id,
            }
         }
         const result = await newsesCollection.updateOne(filter, updatedDoc, option);
         res.send(result)
      })

      app.delete('/news/:id', async (req, res) => {
         const id = req.params.id;
         const result = await newsesCollection.deleteOne({ _id: ObjectId(id) });
         res.send(result)
      })
      app.delete('/deletecategory', async (req, res) => {
         const id = req.body._id;
         const result = await categoriesCollection.deleteOne({ _id: ObjectId(id) });
         res.send(result)
      })

      app.put('/editcategory', async (req, res) => {
         const id = req.body._id;
         const name = req.body.name;
         const filter = { _id: ObjectId(id) }
         const option = { upsert: true }
         const updatedDoc = {
            $set: {
               name: name
            }
         }
         const result = await categoriesCollection.updateOne(filter, updatedDoc, option);
         res.send(result)
      })
      app.get('/news/search/:name', async (req, res) => {
         let name = req.params.name;
         let mainName = name;
         let uppercaseName = name.toUpperCase();
         name = name?.charAt(0)?.toUpperCase() + name?.slice(1);
         const categoryNews = await (newsesCollection.find({ category_id: name })).toArray();
         const headingNews = await (newsesCollection.find({ heading: { $regex: `.*${name}.*` } })).toArray();
         const headingNews2 = await (newsesCollection.find({ heading: { $regex: `.*${mainName}.*` } })).toArray();
         const headingNews3 = await (newsesCollection.find({ heading: { $regex: `.*${uppercaseName}.*` } })).toArray();
         const result = [...categoryNews, ...headingNews, ...headingNews2,...headingNews3]
         console.log(result);
         res.send(result)

      })

   }
   finally { }
}
run().catch(error => console.error(error));

app.listen(port, () => {
   console.log(`News-71 server is running on ${port}`);
})