/**
 * Created by braddavis on 6/19/17.
 */
var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
app.get('/', function (req, res){
    var exec = require('child_process').exec;
    var cmd = './app/rclone.sh';

    if(req.query.command){
        cmd += ' -c='+req.query.command;
    }

    if(req.query.path){
        cmd += ' -p='+req.query.path;
    }

    console.log("Command we are sending", cmd);

    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
    });

    res.send('rClone shell script started.');
});

app.listen(PORT);
console.log('rClone-server started on http://localhost:' + PORT);