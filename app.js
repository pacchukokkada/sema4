const e = require('express');
const express = require('express');
const {sendInBlue} =require('./mailHelper');
var ejs = require('ejs');
var multer  = require('multer')
const path = require('path');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('semaphore.db');
db.run("CREATE TABLE IF NOT EXISTS Teams (id INTEGER PRIMARY KEY AUTOINCREMENT, collegename TEXT, stream TEXT, teamname TEXT, email TEXT, ph TEXT,mode TEXT)");
db.run("CREATE TABLE IF NOT EXISTS Payments (id INTEGER PRIMARY KEY AUTOINCREMENT, teamname TEXT, email TEXT, phno TEXT,photoname TEXT)");
db.run("CREATE TABLE IF NOT EXISTS contactus (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT,msg TEXT)");

const app = express();
const port = process.env.PORT || 8080;

const static_path = path.join(__dirname);
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
var fname;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      // fname=file.originalname;
      fname=Date.now()+".jpg"
      cb(null, fname)
    }
})
var upload = multer({ storage: storage })



app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post("/register", (req, res) => {
    collegename=req.body.cname
    stream=req.body.stream
    teamname=req.body.tname
    email=req.body.email
    ph=req.body.phno
    db.run("INSERT INTO Teams (collegename,stream,teamname,email,ph,mode) VALUES ('"+collegename+"','"+stream+"','"+teamname+"','"+email+"','"+ph+"','"+req.body.mode+"')", (err) => {
      if (err) {
        var response = "<script>alert('Something went Wrong');window.location.href = 'http://semaphore23.in/#Registration';</script>"
        return res.send(response)
      } else {
        res.sendFile(path.join(__dirname, '/payment/payment.html'));
      };
  });
 })

 app.post("/contactus", (req, res) => {
    cname=req.body.name
    phone=req.body.phone
    email=req.body.email
    msg=req.body.msg
    // db.run("INSERT INTO contactus (name,email,phone,msg) VALUES ('"+cname+"','"+email+"','"+phone+"','"+msg+"')")
    db.run("INSERT INTO contactus (name,email,phone,msg) VALUES ('"+cname+"','"+email+"','"+phone+"','"+msg+"')", (err) => {
      if (err) {
        var response = "<script>alert('Something went Wrong');window.location.href = 'http://semaphore23.in/#ContactUs';</script>"
        return res.send(response)
      } else {
        var response = "<script>alert('Message sent');window.location.href = 'http://semaphore23.in/#ContactUs';</script>"
        return res.send(response)
      };
  });
    // var response = "<script>alert('Message sent');window.location.href = 'http://semaphore23.in/#ContactUs';</script>"
    // return res.send(response)
 })

 app.use(express.static('public'));
 app.post("/payment",upload.single('image'), function (req, res, next) {
    db.run("INSERT INTO Payments (teamname,email,phno,photoname) VALUES ('"+req.body.tname+"','"+req.body.email+"','"+req.body.phno+"','"+fname+"')", (err) => {
      if (err) {
        var response = "<script>alert('Something went Wrong');window.location.href = 'http://semaphore23.in/register';</script>"
        return res.send(response)
      } else {
        console.log(JSON.stringify(req.file))
        var response = "<script>alert('Registration successfull! Check your Mail for more info.');window.location.href = 'http://semaphore23.in/#Registration';</script>";
        // sendInBlue(req.body.email,req.body.tname);
        return res.send(response)
      };
  });
    
  })

  app.set('view engine', 'ejs');
  app.get("/showRegistrationSEMA4", (req, res) => {
    var result=[]
    db.all("SELECT * FROM Teams ORDER BY id DESC", function(err, rows) {
        rows.forEach(function (row) {
          result.push([row.collegename,row.stream,row.teamname,row.email,row.ph]);
        });
        // console.log(result)
        res.render('teams', {data:result});
    });
 })
 app.get("/showPaymentsSEMA4", (req, res) => {
  var result=[]
  db.all("SELECT * FROM Payments ORDER BY id DESC", function(err, rows) {
      rows.forEach(function (row) {
        result.push([row.teamname,row.email,row.phno,row.photoname]);
      });
      // console.log(result)
      res.render('payments', {data:result});
  });
})
app.get("/showMessagesSEMA4", (req, res) => {
  var result=[]
  db.all("SELECT * FROM contactus ORDER BY id DESC", function(err, rows) {
      rows.forEach(function (row) {
        result.push([row.name,row.email,row.phone,row.msg]);
      });
      // console.log(result)
      res.render('message', {data:result});
  });
})

app.listen(port);
console.log('Server started at http://localhost:' + port);
