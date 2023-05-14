var express = require("express")
var app = express()
var formidable = require('formidable');

const cors = require("cors");
const path = require("path")

app.use(cors());

const fs = require("fs")
const PORT = 5000;

app.use(express.static('static'))
app.use(express.json());


app.get("/", function (req, res) {
    res.send("error")
})

app.get("/uploaded", function (req, res) {
    res.setHeader("content-type", "application/json"); // nagłówek
    let data = []
    let prevPath = path.join(__dirname, 'static', 'upload')
    fs.readdir(prevPath, function (err, files) {
        if (err) console.log(err)
        else {
            files.map(val => {
                data.push({ fileName: val, status: false })
            })
            res.send(JSON.stringify(data));
        }
    })



});

app.post("/deleteSelectedFiles", function (req, res) {
    res.setHeader("content-type", "application/json"); // nagłówek

    let selectedArray = req.body.selected
    let prevPath = path.join(__dirname, 'static', 'upload')
    console.log(selectedArray)

    selectedArray.map(el => {
        let filepath = path.join(prevPath, el)
        fs.unlink(filepath, function (err) {
            if (err) console.log(err)
            else console.log("deleted");
        })
    })
    res.end(JSON.stringify(req.body));

});

app.post("/deleteOneFile", function (req, res) {
    res.setHeader("content-type", "application/json"); // nagłówek

    let fileName = req.body.name
    let prevPath = path.join(__dirname, 'static', 'upload')
    let filepath = path.join(prevPath, fileName)

    fs.unlink(filepath, function (err) {
        if (err) console.log(err)
        else console.log("deleted");
    })

    res.end(JSON.stringify(req.body));

});

app.post("/rename", function (req, res) {
    res.setHeader("content-type", "application/json"); // nagłówek

    let prevName = req.body.prevName
    let newName = req.body.newName

    let prevPath = path.join(__dirname, 'static', 'upload')

    let pathA = path.join(prevPath, prevName)
    let pathB = path.join(prevPath, newName)

    fs.rename(pathA, pathB, function (err) {
        if (err) console.log(err)
        else console.log("nazwa zmieniona");
    })

    res.end(JSON.stringify(req.body));

});

app.post('/upload', function (req, res) {

    let form = formidable({});

    form.keepExtensions = true
    form.uploadDir = __dirname + '/static/upload/'

    form.parse(req, function (err, fields, files) {

        console.log("----- files ------");
        console.log(files);

        res.send("file uploaded")
    });

});

app.listen(PORT, function () {
    console.log("Server started on port" + PORT)
})