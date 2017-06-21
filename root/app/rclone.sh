#!/usr/bin/with-contenv sh

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


while getopts p: option
do
 case "${option}"
 in
 p) PATH=${OPTARG};;
 esac
done

echo "Waiting 10 seconds"
sleep 10s

if [ $PATH ]; then
    echo "Clearing $PATH in local directory"
    rm -Rf "/media/$PATH"
else
    echo "We do not have a folder path. Clearing nothing."
fi

exit