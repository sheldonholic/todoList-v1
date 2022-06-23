const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var text = ["Buy Food", " Cook Food"];

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

    res.render("index", { kindOfDay: day, newItem: text });
}
)

app.post("/", function (req, res) {
    var item = req.body.add;
    text.push(item);
    res.redirect("/");
})

app.listen(5500, function () {
    console.log("Started");
})