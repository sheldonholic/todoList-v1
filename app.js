const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();


var text = ["Buy Food", " Cook Food"];
var workList = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-UK", options);

    res.render("index", { listType: date.getDay(), newItem: text });
}
)

//workList
app.get("/work", function (req, res) {

    res.render("index", { listType: "Work List", newItem: workList });
});

//adding about page route
app.get("/about", function (req, res) {
    res.render("about");
}
)

app.post("/", function (req, res) {
    var item = req.body.add;
    if (req.body.button === "Work") {
        workList.push(item);
        res.redirect("/work");
    }
    else {
        text.push(item);
        res.redirect("/");
    }
    //console.log(req.body);


});

//posting data of work list
app.post("/work", function (req, res) {

    var item = req.body.add;
    workList.push(item);
    res.redirect("/work");
});

app.listen(5500, function () {
    console.log("Started");
});