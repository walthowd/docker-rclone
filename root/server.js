var express = require('express');
var log4js = require('log4js');
var exec = require('child_process').exec;
var PORT = 8084;
var app = express();

log4js.configure({
    appenders: {
        rclone_sync: {
            type: 'file', filename: '/logs/rclone_sync.log'
        }
    },
    categories: {
        default: {
            appenders: ['rclone_sync'],
            level: 'info'
        }
    }
});

var rclone_sync_logger = log4js.getLogger('rclone_sync');
app.get('/rclone_sync', function (req, res){

    var rCloneSyncCommand = process.env.SYNC_COMMAND + " --config=/config/rclone.conf" + " --log-file=/logs/rclone_sync.log";
    rclone_sync_logger.info("rclone sync command starting: ", rCloneSyncCommand);

    exec(rCloneSyncCommand, function(error, stdout, stderr) {
        error ? rclone_sync_logger.error("RCLONE SYNC COMMAND error: ", error) : rclone_sync_logger.info("RCLONE SYNC COMMAND done: ", stdout, stderr);

    });

    res.send('rclone sync started');
});

app.listen(PORT);
rclone_sync_logger.info('rClone-server started on http://localhost:' + PORT);
