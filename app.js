const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todoList");

const itemSchema = new mongoose.Schema(
    {
        name: String
    }
);

const listModel = mongoose.model(
    "item",
    itemSchema
);

const workModel = mongoose.model(
    "work",
    itemSchema
);


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
    listModel.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { listType: date.getDay(), newItem: doc });
        }
    });


}
)

//workList
app.get("/work", function (req, res) {
    workModel.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { listType: "Work List", newItem: doc });
        }
    });

});

//adding about page route
app.get("/about", function (req, res) {
    res.render("about");
}
)

app.post("/", function (req, res) {
    var item = req.body.add;
    if (req.body.button === "Work") {
        const item1 = new workModel(
            {
                name: item
            }
        );
        item1.save();

        res.redirect("/work");
    }
    else {
        const item1 = new listModel(
            {
                name: item
            }
        );
        item1.save();

        res.redirect("/");
    }
    //console.log(req.body)


});

app.post("/delete", function (req, res) {
    const item = req.body.done;
    listModel.deleteOne({ name: item }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });

});

//posting data of work list
app.post("/work", function (req, res) {

    var item = req.body.add;
    workList.push(item);
    res.redirect("/work");
});


app.post("/delete", function (req, res) {
    console.log(req.body);
})


app.get("/:title", function (req, res) {
    var value = req.params.title;
    posts.forEach(function (p) {
        if (p.title === value || lodash.kebabCase(p.title) === value) {
            res.render("post", { title: p.title, content: p.content });
        }
    });
    //console.log("Not found");
});


app.listen(process.env.PORT || 5500, function () {
    console.log("Started");
});