/**
 * Created by braddavis on 6/19/17.
 */
var express = require('express');

// Constants
var PORT = 8080;

// App
var app = express();
var exec = require('child_process').exec;

app.get('/', function (req, res){

    var folder = req.query.folder || null;

    var rCloneSyncCommand = process.env.SYNC_COMMAND + ' \; 2>/dev/null';
    var cleanupCommand = 'rm -r /media/' + (folder ? folder + '/' : '*') + ' \; 2>/dev/null';
    var removeEmptyDirs = 'find . -depth -type d -exec rmdir {} \; 2>/dev/null';

    console.log("rCloneSyncCommand STARTING: ", rCloneSyncCommand);
    exec(rCloneSyncCommand, function(error, stdout, stderr) {

        if(error){
            return console.log("rCloneSyncCommand ERROR: ", error);
        } else {
            console.log("rCloneSyncCommand DONE: ", stdout, stderr);
        }


        console.log("cleanupCommand STARTING:", cleanupCommand);
        exec(cleanupCommand, {'cwd': '/'}, function(error, stdout, stderr){


            if(error){
                return console.log("cleanupCommand ERROR: ", error);
            } else {
                console.log("cleanupCommand DONE: ", stdout, stderr);

                console.log("removeEmptyDirs STARTING");
                exec(removeEmptyDirs, {'cwd': '/media'}, function(error, stdout, stderr){


                    if(error){
                        return console.log("removeEmptyDirs ERROR: ", error);
                    } else {
                        console.log("removeEmptyDirs DONE: ", stdout, stderr);
                    }

                });


            }

        });
        // command output is in stdout
    });

    res.send('rClone shell script started.');
});

app.listen(PORT);
console.log('rClone-server started on http://localhost:' + PORT);