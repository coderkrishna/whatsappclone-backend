//importing 
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Messages from './models/messageSchema' 
//app config
const app = express()
dotenv.config()
const port = process.env.PORT || 9000 ;
//middleware
app.use(express.json())
//

//Dbconfig
mongoose.connect(process.env.DB_CONNECTION_PATH,{
   useCreateIndex : true,
   useNewUrlParser : true,
   useUnifiedTopology : true     
})


//apiroutes
app.get('/',(req,res)=> res.status(200).send('hello world'))

app.post('/api/v1/messages/new',(req,res) => {
      const dbMessage = req.body;
      
      console.log(Messages)    
      Messages.create(dbMessage,(err,data)=> {
         if(err){
             res.status(500).send(err);
         } else {
             res.status(200).send(data);
         } 
      })
})
//listeners

app.listen(port,() => console.log(`Listening on localhost:${port}`));


