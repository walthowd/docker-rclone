/**
 * Created by braddavis on 6/19/17.
 */
var express = require('express');
var log4js = require('log4js');
var exec = require('child_process').exec;
var PORT = 8080;
var app = express();



log4js.configure({
    appenders: {
        rclone_move: {
            type: 'file', filename: '/logs/rclone_move.log'
        },
        unionfs_cleanup: {
            type: 'file', filename: '/logs/unionfs_cleanup.log'
        }
    },
    categories: {
        default: {
            appenders: ['rclone_move', 'unionfs_cleanup'],
            level: 'info'
        }
    }
});





var rclone_move_logger = log4js.getLogger('rclone_move');
app.post('/rclone_move', function (req, res){

    var rCloneSyncCommand = process.env.SYNC_COMMAND + " --config=/config/rclone.conf" + " --log-file=/logs/server.log --min-age 1m --delete-after";
    rclone_move_logger.info("RCLONE MOVE COMMAND STARTING: ", rCloneSyncCommand);

    exec(rCloneSyncCommand, function(error, stdout, stderr) {
        error ? rclone_move_logger.error("RCLONE MOVE COMMAND ERROR: ", error) : rclone_move_logger.info("RCLONE MOVE COMMAND DONE: ", stdout, stderr);

        //Clean up empty folders
        var removeEmptyDirs = 'find . -depth -type d -exec rmdir {} \\; 2>/dev/null';
        exec(removeEmptyDirs, {'cwd': '/local_media'});
    });

    res.send('RCLONE MOVE STARTED');
});





var unionfs_cleanup_logger = log4js.getLogger('unionfs_cleanup');
app.post('/unionfs_cleanup', function(req, res){

    unionfs_cleanup_logger.info("UNIONFS CLEANUP COMMAND STARTING:", "Blah balh");

    unionfs_cleanup_logger.info("UNIONFS CLEANUP COMMAND DONE:", "Blah balh blah blah");

    res.send('unionFS cleanup started');
});







app.listen(PORT);
rclone_move_logger.info('rClone-server started on http://localhost:' + PORT);