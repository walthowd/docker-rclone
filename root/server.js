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

    // var cmd = './app/rclone.sh';

    var rCloneSyncCommand = process.env.SYNC_COMMAND;
    var cleanupCommand = 'find "/media" -depth -exec rmdir {} \; 2>/dev/null';

    console.log(rCloneSyncCommand);
    exec(rCloneSyncCommand, function(error, stdout, stderr) {
        console.log("rCloneSyncCommand RESPONSE: ", error, stdout, stderr);


        console.log(cleanupCommand);
        exec(cleanupCommand, function(error, stdout, stderr){

            console.log("cleanupCommand RESPONSE: ", error, stdout, stderr);

        });
        // command output is in stdout
    });

    res.send('rClone shell script started.');
});

app.listen(PORT);
console.log('rClone-server started on http://localhost:' + PORT);