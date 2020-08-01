var express = require("express");
var path = require("path");
var fs = require("fs");
var {v4: uuidv4} = require('uuid');

var app = express();
var PORT = process.env.PORT || 3000;

//read in static folders eg css.
app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Basic route that sends the user first to the Home Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


// API Routes
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./db/db.json"))
});

// Post note method
app.post("/api/notes", function (req, res) {
  var addNote = {
    id: uuidv4(), 
    title: req.body.title,
    text: req.body.text
  }

  var listNote = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8"))

  listNote.push(addNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(listNote));
  res.json(listNote);
  console.log("note saved")
});

//Delete note method
app.delete("/api/notes/:id", function (req, res) {
  var delId = req.params.id;
  var listNote = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8"))
  var delNote = listNote.filter(item => item.id != delId);

 
  fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
  res.send(delNote);
  console.log("note deleted")
});



app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});