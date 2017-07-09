#!/usr/bin/with-contenv sh

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/config/rclone.log 2>&1

echo "===========beginning script============="

(
  flock -n 200 || exit 1

  echo "Executing => $SYNC_COMMAND"
  eval "$SYNC_COMMAND"

) 200>/var/lock/rclone.lock


find "/media" -depth -exec rmdir {} \; 2>/dev/null

exit