var formidable = require('formidable');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.static(__dirname)); 
app.use(express.static(__dirname + '/Resources')); // load static resources
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});  

app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(util.inspect({
        //     fields: fields,
        //     files: files
        // }));
 
        fs.readFile(files.RemoteFile.path, function (err, data) {
            // save file from temp dir to new dir
            var newPath = __dirname + "/UploadedImages/" + files.RemoteFile.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) throw err;
                console.log('file saved');
                res.end();
            });
        });
    });
})

var server = app.listen(2016, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
})