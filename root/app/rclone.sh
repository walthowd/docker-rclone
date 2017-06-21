#!/usr/bin/with-contenv sh

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/app/rclone.log 2>&1

echo "===========beginning script============="

(
  flock -n 200 || exit 1

  sync_command="rclone sync /data $SYNC_DESTINATION:/'$SYNC_DESTINATION_SUBPATH'"


  if [ "$SYNC_COMMAND" ]; then
    sync_command="$SYNC_COMMAND"
  else
    if [ -z "$SYNC_DESTINATION" ]; then
      echo "Error: SYNC_DESTINATION environment variable was not passed to the container."
      exit 1
    fi
  fi

  echo "Executing => $sync_command"
  eval "$sync_command"

) 200>/var/lock/rclone.lock


find "/media" -depth -exec rmdir {} \; 2>/dev/null

exit