const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();
const lodash = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-shalaka:atlas%402013@cluster0.yypcgod.mongodb.net/todoList");

const itemSchema = new mongoose.Schema(
    {
        name: String
    }
);

const listModel = mongoose.model(
    "item",
    itemSchema
);

const l1 = new listModel(
    {
        name: "Welcome to a new list"
    }
)
const l2 = new listModel(
    {
        name: "Add new items to the list"
    }
)

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
            res.render("index", { listType: /*date.getDay()*/ "Today", newItem: doc });
        }
    });


}
)


const newSchema = new mongoose.Schema({
    name: String,
    item: [itemSchema]
});

const newModel = mongoose.model("lists", newSchema);


//workList

app.get("/:title", function (req, res) {

    const value = req.params.title;

    newModel.findOne({ name: value }, function (err, flist) {
        if (!err) {
            if (!flist) {
                const list = new newModel(
                    {
                        name: value,
                        item: [l1, l2]
                    }
                );
                list.save();
                res.redirect("/" + value);
            }
            else {
                res.render("index", { listType: flist.name, newItem: flist.item });
            }
        }
    })
});

//adding about page route
app.get("/about", function (req, res) {
    res.render("about");
}
)

app.post("/", function (req, res) {
    const itemName = req.body.add;
    const listName = req.body.button;
    //console.log(itemName);
    const item1 = new listModel({
        name: itemName
    });

    if (listName === "Today") {
        item1.save();
        res.redirect("/");
    } else {
        newModel.findOne({ name: listName }, function (err, foundList) {
            foundList.item.push(item1);
            foundList.save();
            ///console.log(foundList.item);
            res.redirect("/" + listName);
        });
    }


});

app.post("/delete", function (req, res) {
    const itemm = req.body.done;
    const type = req.body.listname;
    if (type == "Today") {
        listModel.deleteOne({ name: itemm }, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/");
            }
        });
    }
    else {
        newModel.updateOne(
            { name: type }, //$pull is used for nested document deletion
            { $pull: { item: { name: itemm } } }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/" + type);
                }
            }
        )

    }

});

//posting data of work list
app.post("/:title", function (req, res) {

    var value = req.params.title;
    var item = req.body.add;
    const add = new newModel(
        {
            name: value
        }
    )



    newModel.findOne({ name: value }, function (err, doc) {
        if (!err) {
            arr = doc.item;
            arr.push(item);
            newModel.updateOne({ name: value }, { item: arr }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect("/" + value);
                }
            })
        }
    })

});


app.listen(process.env.PORT || 5500, function () {
    console.log("Started");
});