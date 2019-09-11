let express = require('express');
var mongoose = require('mongoose');
let app = express();

var task = require('./models/task');
var developer = require('./models/developer');

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);

let mongodb = require('mongodb');
// let MongoClient = mongodb.MongoClient;
// let url = 'mongodb://localhost:27017/Week7LabDB';
mongoose.connect('mongodb://localhost:27017/Week7LabDB',function(err){
    if(err){
        console.log(err);
        throw err;
    }else{
        console.log('connected succeffuly');
    }
})
// MongoClient.connect(url,{useNewUrlParser: true,useUnifiedTopology: true},function(err,client){
//     if(err){
//         console.log('err',err);
//     }else{
//         db = client.db('fit2095db');
//         col = db.collection('task');
//     }
// })

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({extended:false}));
app.use(express.static('img'));
app.use(express.static('css'));

var db = [];

var filePath = __dirname + "/views/";

app.get('/',function(req,res){
    let fileName = filePath + "index.html";
    res.sendFile(fileName);
});

app.get('/newTask',function(req,res){
    let fileName = filePath + "addNewTask.html";
    res.sendFile(fileName);
})

app.post('/addNewTask',function(req,res){
    let taskDetails = req.body;
    // let date= Date.parse(req.body.dueDate)
    // col.insertOne({name:taskDetails.taskName,assignName:taskDetails.assignTo,dueDate:date,
    //     taskStatus:taskDetails.taskStatus,taskDescription:taskDetails.taskDescription},function(err,result){
    //     if(err){
    //         console.log('err',err);
    //     }else{
    //         res.redirect('/listTasks');
    //     }
    // })
    task.create({
        name:taskDetails.taskName,
        assignTo:{_id:new mongoose.Types.ObjectId(taskDetails.assignTo)},
        dueDate:taskDetails.dueDate,
        taskStatus:taskDetails.taskStatus,
        taskDescription:taskDetails.taskDescription
    },function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/listTasks');
        }
    })
});

app.post('/updateTask',function(req,res){
    let taskDetails = req.body;
    task.updateOne({_id:taskDetails.taskID},{$set:{taskStatus: taskDetails.ntaskStatus}},function (err, doc) {
        console.log(doc);
    });
    res.redirect('/listTasks');
});

app.get('/update',function(req,res){
    let fileName = filePath + "updateTask.html";
    res.sendFile(fileName);
})

app.get('/delete',function(req,res){
    let fileName = filePath + "deleteTask.html";
    res.sendFile(fileName);
})

app.post('/deleteTask', function (req, res) {
    let taskDetails = req.body;
    task.deleteOne({_id: new mongodb.ObjectID(taskDetails.taskID)},function (err, doc) {
        console.log(doc);
    })
    res.redirect('/listTasks');
});

app.post('/deleteAll',function(req,res){
    // col.deleteMany({taskStatus:"Complete"}, function (err, obj) {
    //     console.log(obj.result);
    //   });
    task.deleteMany({taskStatus:"Complete"},function (err, doc) {
        console.log(doc);
    })
      res.redirect('/listTasks');
})

app.get('/deleteOldComplete',function(req,res){
    var curDate = new Date();
    task.deleteMany({taskStatus:"Complete"},{$lt:curDate},function (err, doc) {
        console.log(doc);
    })
      res.redirect('/listTasks');
})

app.get('/listTasks',function(req,res){
   task.find().populate('developer').exec(function(err,data){
    // res.send(data);
    //db.push(data);
    res.render("listTasks",{tasks: data});
   })
});

// app.post('/add',function(req,res){
//     db.push(req.body);
//     res.render("listTasks",{tasks: task});
// });


///////////////////////////////////////////////////////////////////////////////////////


app.get('/newDeveloper',function(req,res){
    let fileName = filePath + "addNewDeveloper.html";
    res.sendFile(fileName);
})

app.post('/addNewDeveloper',function(req,res){
    developer.create({
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName
        },
        level:req.body.level,
        address:{
            State:req.body.state,
            Suburb:req.body.suburb,
            Street:req.body.street,
            Unit:req.body.unit
        }
    })
            res.redirect('/listDevelopers');
});

app.get('/listDevelopers',function(req,res){
    developer.find().exec(function(err,data){
        if(err){
            console.log(err);
        }else{
        res.render("listDevelopers",{developers: data});
        }
    })
});


//////////////////////////////////////EXTRA TASK//////////////////////////////////////


app.get('/:oldfirstname/:newfirstname',function(req,res){
    developer.updateMany({'name.firstName':req.params.oldfirstname },{$set:{'name.firstName':req.params.newfirstname}},function (err, doc) {
    console.log(doc);
    res.redirect('/listDevelopers');
    })
});


app.listen(8888);