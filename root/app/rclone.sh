#!/usr/bin/with-contenv sh

if [ -z "{$REMOTE_SYNC}" ]; then
 echo "REMOTE_SYNC environment variable was not passed to the container."
 exit 1
else
 echo "Running => rclone sync /config {$REMOTE_SYNC}:/"
 rclone sync /config ${REMOTE_SYNC}:/
 echo "rclone done!"
fi