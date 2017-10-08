#!/bin/bash

UNIONFSRWPATH=/local
PLEXDRIVEPATH=/plexdrive

find $UNIONFSRWPATH/.unionfs-fuse -name '*_HIDDEN~' | while read line; do
    oldPath=${line#/$UNIONFSRWPATH/.unionfs-fuse}
    newPath=$PLEXDRIVEPATH${oldPath%_HIDDEN~}
    echo "$newPath"
    echo "$line"
done

find "$UNIONFSRWPATH/.unionfs-fuse" -mindepth 1 -type d -empty -delete
exit