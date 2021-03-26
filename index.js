const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = "rOzNftSkpQj1Mh42";


const uri = "mongodb+srv://organicuser:rOzNftSkpQj1Mh42@cluster0.vki6z.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })

    app.get('/product/:id',(req,res) =>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err,document) =>{
            res.send(document[0]);
        })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully');
                res.redirect('/')
            })
    })

    app.patch('/update/:id',(req,res)=>{
        console.log(req.body.price);
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
        {
            $set: {price:req.body.price,quantity:req.body.quantity}
        })
        .then(result=>{
           // console.log(result);
           res.send(result.modifiedCount > 0);
        })
   
    })

    app.delete('/delete/:id', (req, res) => {
        const ObjectId = require('mongodb').ObjectId;
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
               // console.log(result);
               res.send(result.deletedCount>0);
               if(result){
                   event.target.parentNode.style.display.none;
               }
            })
    })



    // perform actions on the collection object

});
app.listen(3000);