var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a sample model
var SampleSchema = new mongoose.Schema({
  name: String,
});
var Sample = mongoose.model("Sample", SampleSchema);

// Routes
app.get("/", function (req, res) {
  res.send("Test: Landing Page");
});

app.post("/sample", function (req, res) {
  var newSample = new Sample(req.body);
  newSample.save(function (err, sample) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(sample);
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("AdamAurelio.com web server is on");
});
