let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    name:String,
    assignTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'developer'
    },
    dueDate:{
        type:Date,
        default:Date.now
    },
    taskStatus:{
        type:String
    },
    taskDescription:String
})

let taskModel=mongoose.model('task',taskSchema,'task');
module.exports = taskModel;