/**
 * Created by braddavis on 6/19/17.
 */
var express = require('express');
var log4js = require('log4js');
var exec = require('child_process').exec;
var PORT = 8080;
var app = express();

log4js.configure({
    appenders: { server: { type: 'file', filename: '/logs/server.log' } },
    categories: { default: { appenders: ['server'], level: 'info' } }
});
var logger = log4js.getLogger('server');

app.post('/', function (req, res){

    var rCloneSyncCommand = process.env.SYNC_COMMAND + " --config=/config/rclone.conf" + " --log-file=/logs/server.log --min-age 1m --delete-after";
    logger.info("rCloneSyncCommand STARTING: ", rCloneSyncCommand);

    exec(rCloneSyncCommand, function(error, stdout, stderr) {
        error ? logger.error("rCloneSyncCommand ERROR: ", error) : logger.info("rCloneSyncCommand DONE: ", stdout, stderr);

        //Clean up empty folders
        var removeEmptyDirs = 'find . -depth -type d -exec rmdir {} \\; 2>/dev/null';
        exec(removeEmptyDirs, {'cwd': '/local_media'});
    });

    res.send('rClone shell script started.');
});

app.listen(PORT);
logger.info('rClone-server started on http://localhost:' + PORT);