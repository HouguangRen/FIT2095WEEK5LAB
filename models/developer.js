let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level:{
        type:String,
        required:true
    },
    address:{
        State:String,
        Suburb:String,
        Street:String,
        Unit:String
    }
})

let developerModel = mongoose.model('developer',developerSchema,'developer');
module.exports = developerModel;