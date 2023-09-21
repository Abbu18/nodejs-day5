const express = require('express');
// object destructuring
const {MongoClient, ObjectId} = require('mongodb');
//ES5 usage of mongoclient
//const mongoClient = require('mongodb').mongoClient;
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID

const app =express();

const MongoURL = 'mongodb://127.0.0.1:27017/';
const port =4001;

//connection to database
//previously mongodb has two connection string mongodb+srv: // mongobd://
const client = new MongoClient(MongoURL,{
    usenewURLparser:true,
    useUnifiedTopology:true
})

//Express Middlewear Section
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("welcome to nodejs server")
})

// get orderdetails end point
app.get('/getOrderDetails', (request,response)=>{
    client.connect((dbconnectionerror,connection)=>{
        if(dbconnectionerror){
        response.send({
            status: 500, message: "db connection error"
        })
        }
        else{
        const db = connection.db("zomatodb")
        db.collection('orderdetails').find().toArray((err,result)=>{
            if(err){
                console.log(err)

            } else {
                response.send(result)
            }
        })
    }})
})


// post orderdetails end point
app.post('/addOrderDetails', (request,response)=>{
    client.connect((dbconnectionerror,connection)=>{
        if(dbconnectionerror){
        response.send({
            status: 500, message: "db connection error"
        })
        }else{
        const db = connection.db("zomatodb")
        db.collection('orderdetails').insertOne(request.body,((err,result)=>{
            if(err){
                console.log(err)

            } else {
                response.send("order details added")
            }
        })
    )}})
})


// update orderdetails end point
app.put("/updateOrderDetails", (request, response) => {
    client.connect((dbconnectionerror, connection) => {
      if (dbconnectionerror) {
        response.send({
          status: 500, message: "db connection error",
        });
      } else {
        const db = connection.db("zomatodb");
        db.collection("orderdetails").updateOne({_id : ObjectId(request.body._id)},{$set :{price:request.body.price}},request.body,(err, result) => {
            if (err) {
              console.log(err);
            } else {
              response.send("order details updated successfully");
            }
          });
      }
    });
  });


//Delete orderdetails end point
app.delete("/deleteOrderDetails", (request, response) => {
    client.connect((dbconnectionerror, connection) => {
      if (dbconnectionerror) {
        response.send({
          status: 500, message: "db connection error",
        });
      } else {
        const db = connection.db("zomatodb");
        db.collection("orderdetails").remove({_id : ObjectId(request.body._id)},(err, result) => {
            if (err) {
              console.log(err);
            } else {
              response.send("order details deleted successfully");
            }
          });
      }
    });
  });



app.listen(port,()=>{
    console.log('server started on port',port)
})