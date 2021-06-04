//importing 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Messages = require('./models/messageSchema');
const Pusher = require('pusher');
const cors =require('cors');

//app config
const app = express()
dotenv.config()
const port = process.env.PORT || 9000 ;

const pusher = new Pusher({
    appId: "1214330",
    key: "8698d31322d7fd9328c1",
    secret: "2dbda47f06df8f1eecac",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})

//

//Dbconfig
mongoose.connect(process.env.DB_CONNECTION_PATH,{
   useCreateIndex : true,
   useNewUrlParser : true,
   useUnifiedTopology : true     
},() => {
    console.log("Connected to the database succesfully");
})

const db =  mongoose.connection

db.once('open',() => {

    const msgCollection = db.collection('messages');
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change) => {
        console.log(change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
               name : messageDetails.name,
               message : messageDetails.message,
               timestamp : messageDetails.timestamp,
               received : messageDetails.received          
            }

            )
        }else{
            console.log('error trigerring pusher');
        }
    })
    
})


//apiroutes
app.get('/',(req,res)=> res.status(200).send('hello world'))

app.get('/api/v1/messages/sync',(req,res) => {
    Messages.messageModel.find((err,data) =>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    });
})

app.post('/api/v1/messages/new',(req,res) => {
      const dbMessage = req.body;
          
      Messages.messageModel.create(dbMessage,(err,data)=> {
         if(err){
             res.status(500).send(err);
         } else {
             res.status(200).send(data);
         } 
      });
})
//listeners

app.listen(port,() => console.log(`Listening on localhost:${port}`));


