var express = require("express");
var app = express();

app.get("/"), function(req,res){
    res.send("Test: Landing Page");
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("AdamAurelio.com web server is on");
});