let express = require('express');
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyparse = require('body-parser');

app.use(bodyparse.urlencoded({extended:false}));
app.use(express.static('img'));

var db = [];

var filePath = __dirname + "/views/";

app.get('/',function(req,res){
    let fileName = filePath + "index.html";
    res.sendFile(fileName);
});

app.get('/addNewTask',function(req,res){
    let fileName = filePath + "addNewTask.html";
    res.sendFile(fileName);
});

app.get('/listTasks',function(req,res){
    res.render("listTasks",{tasks: db});
});

app.post('/add',function(req,res){
    db.push(req.body);
    res.render("listTasks",{tasks: db});
});

app.listen(8888);