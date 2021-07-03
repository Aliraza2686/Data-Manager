const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
  
})

const Task = mongoose.model('task', taskSchema)

module.exports = Task