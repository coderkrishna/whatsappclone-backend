import mongoose from 'mongoose'

const whatsappSchema = mongoose.Schema({
    message : {
        type : String,
        trim : true
    },
    name : {
        type : String,
        trim : true
    },
    timestamp : {
        type: String,
    },
    received : {
        type : Boolean,
    }
    
});

const messageModel = mongoose.model('message',whatsappSchema);
 module.exports = {messageModel}
