#!/bin/bash

UNIONFSRWPATH=/local
PLEXDRIVEPATH=/plexdrive
METADATAPATH=/.unionfs-fuse

find $UNIONFSRWPATH$METADATAPATH -name '*_HIDDEN~' | while read line; do

    FULLMETADATAPATH=$UNIONFSRWPATH$METADATAPATH${line#$UNIONFSRWPATH$METADATAPATH}
    echo Metadata Path:   $FULLMETADATAPATH


    CLOUDPATH="${FULLMETADATAPATH/$UNIONFSRWPATH$METADATAPATH/$PLEXDRIVEPATH}"
    CLOUDPATH=${CLOUDPATH%_HIDDEN~}
    echo Cloud Path:   $CLOUDPATH


    rm "$FULLMETADATAPATH"
    rm "$CLOUDPATH"

    echo "=========================================="

done

find $UNIONFSRWPATH$METADATAPATH -depth -type d -exec rmdir {} \;
exit