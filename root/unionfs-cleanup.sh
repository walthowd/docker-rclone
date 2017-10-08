#Source - did not clone with github cause I need inside docker container
#https://github.com/ErAzOr2k/syncunionfstorclone/blob/master/syncunionfstorclone

#!/bin/sh
if pidof -o %PPID -x "$(basename $0)"; then
  exit 1
fi


while getopts ':d' opts; do
    case "${opts}" in
        d) RCLONEDEST=$OPTARG ;; # rclone destination
    esac
done


echo "Here is rclone dest: $RCLONEDEST"


###########################################################################################################

# Change parameters to suit your needs:
UNIONFSRWPATH='/local_media' # unionfs-fuse RW directory
#RCLONEDEST='gdrive_clusterboxcloud:cb/' # rclone destination
EXCLUDE='/root/exclude' # File of specified excluded paths
MINAGE=300 # minimum age of files to transfer (in minutes)
CACHETIME=5 # Rclone directory cache time (in minutes)

###########################################################################################################

# Do not change anything below!
LOGFILE="/var/log/$(basename ${0%.*}).log"
RCLONEDEST="${RCLONEDEST%/}/"
UNIONFSMETADIR=".unionfs"
UNIONFSSUFFIX="_HIDDEN~"
UNIONFSRWPATH="${UNIONFSRWPATH%/}/"
UNIONFSMETAPATH="$UNIONFSRWPATH/$UNIONFSMETADIR"

# SYNC UNIONFS METADATA WITH RCLONE RESTINATION
# Remove folders
while IFS= read -r -d '' FOLDER; do
  # Build path to delete
  RCLONEDELETEFOLDER="$RCLONEDEST${FOLDER#*$UNIONFSMETAPATH/}"; RCLONEDELETEFOLDER="${RCLONEDELETEFOLDER%$UNIONFSSUFFIX}"

  # Delete on rclone destination
  echo "$(date "+%Y/%m/%d %T") Deleting directory: $RCLONEDELETEFOLDER" | tee -a $LOGFILE
  rclone purge "$RCLONEDELETEFOLDER" 2>&1 | tee -a $LOGFILE

  # Delete on unionfs
  echo "rm -r -f '$FOLDER' && rm -r -f "${FOLDER%$UNIONFSSUFFIX}"" | at now + $CACHETIME min > /dev/null 2>&1
done < <(find $UNIONFSMETAPATH -depth -type d -mmin +$MINAGE -name *$UNIONFSSUFFIX -print0)

# Remove files
while IFS= read -r -d '' FILE; do
  # Build path to delete
  RCLONEDELETEFILE="$RCLONEDEST${FILE#*$UNIONFSMETAPATH/}"; RCLONEDELETEFILE="${RCLONEDELETEFILE%$UNIONFSSUFFIX}"

  # Delete on rclone destination
  echo "$(date "+%Y/%m/%d %T") Deleting file: $RCLONEDELETEFILE" | tee -a $LOGFILE
  rclone delete "$RCLONEDELETEFILE" 2>&1 | tee -a $LOGFILE

  # Delete on unionfs
  echo "rm -f '$FILE'" | at now + $CACHETIME min > /dev/null 2>&1
done < <(find $UNIONFSMETAPATH -type f -mmin +$MINAGE -name *$UNIONFSSUFFIX -print0)

# MOVE FILES FROM UNIONFS RW DIRECTORY TO RCLONE DESTINATION
#if [[ -n $(rclone ls $UNIONFSRWPATH --min-age "$MINAGE"m --exclude "$UNIONFSMETADIR**") ]]; then
#  rclone move $UNIONFSRWPATH $RCLONEDEST --verbose --checksum --no-traverse --transfers=3 --checkers=3 --delete-after --min-age "$MINAGE"m --exclude "$UNIONFSMETADIR**" 2>&1 | tee -a $LOGFILE
#fi

# CLEANING UP UNIONFS RW DIRECTORY
#if [ -n "$(find $UNIONFSRWPATH -depth -mindepth 1 -type d -not -path "$UNIONFSMETAPATH/*" -mmin +$MINAGE -empty)" ]; then
#  echo "$(date "+%Y/%m/%d %T") Cleaning up unionfs RW directory" | tee -a $LOGFILE
#  find $UNIONFSRWPATH -depth -mindepth 1 -type d -not -path "$UNIONFSMETAPATH/*" -mmin +$MINAGE -empty -exec rm -r {} \;
#fi

exit