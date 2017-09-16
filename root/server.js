/**
 * Created by braddavis on 6/19/17.
 */
var express = require('express');
var log4js = require('log4js');

log4js.configure({
    appenders: { server: { type: 'file', filename: '/logs/server.log' } },
    categories: { default: { appenders: ['server'], level: 'info' } }
});


var logger = log4js.getLogger('server');

// Constants
var PORT = 8080;

// App
var app = express();
var exec = require('child_process').exec;

app.get('/', function (req, res){

    var folder = req.query.folder || null;

    var rCloneSyncCommand = process.env.SYNC_COMMAND + ' \; 2>/dev/null';
    var cleanupCommand = 'rm -r /media/' + (folder ? folder + '/' : '*') + ' \; 2>/dev/null';
    var removeEmptyDirs = 'find . -depth -type d -exec rmdir {} \\; 2>/dev/null';

    logger.info(folder, "rCloneSyncCommand STARTING: ", rCloneSyncCommand);
    exec(rCloneSyncCommand, function(error, stdout, stderr) {

        if(error){
            return logger.info(folder, "rCloneSyncCommand ERROR: ", error);
        } else {
            logger.info(folder, "rCloneSyncCommand DONE: ", stdout, stderr);
        }


        logger.info(folder, "cleanupCommand STARTING:", cleanupCommand);
        exec(cleanupCommand, {'cwd': '/'}, function(error, stdout, stderr){


            if(error){
                return logger.info(folder, "cleanupCommand ERROR: ", error);
            } else {
                logger.info(folder, "cleanupCommand DONE: ", stdout, stderr);

                logger.info(folder, "removeEmptyDirs STARTING", removeEmptyDirs);
                exec(removeEmptyDirs, {'cwd': '/media'}, function(error, stdout, stderr){


                    if(error){
                        return logger.info(folder, "removeEmptyDirs ERROR: ", error);
                    } else {
                        logger.info(folder, "removeEmptyDirs DONE: ", stdout, stderr);
                    }

                });


            }

        });
        // command output is in stdout
    });

    res.send('rClone shell script started.');
});

app.listen(PORT);
logger.info('rClone-server started on http://localhost:' + PORT);