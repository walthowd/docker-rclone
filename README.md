[appurl]: https://rclone.org/
[microbadger]: https://microbadger.com/images/walthowd/docker-rclone
[dockerstore]: https://store.docker.com/community/images/walthowd/docker-rclone

# docker-rclone
[![Docker Layers](https://images.microbadger.com/badges/image/walthowd/docker-rclone.svg)][microbadger]
[![Docker Pulls](https://img.shields.io/docker/pulls/walthowd/docker-rclone.svg)][dockerstore]
[![Docker Stars](https://img.shields.io/docker/stars/walthowd/docker-rclone.svg)][dockerstore]
[![Docker Build Status](https://img.shields.io/docker/build/walthowd/docker-rclone.svg)][dockerstore]
[![Docker Build](https://img.shields.io/docker/automated/walthowd/docker-rclone.svg)][dockerstore]

Docker for [Rclone][appurl] - a command line program to sync files and directories to and from various cloud services.

**Cloud Services**
* Google Drive
* Amazon S3
* Openstack Swift / Rackspace cloud files / Memset Memstore
* Dropbox
* Google Cloud Storage
* Amazon Drive
* Microsoft One Drive
* Hubic
* Backblaze B2
* Yandex Disk
* The local filesystem

**Features**

* MD5/SHA1 hashes checked at all times for file integrity
* Timestamps preserved on files
* Partial syncs supported on a whole file basis
* Copy mode to just copy new/changed files
* Sync (one way) mode to make a directory identical
* Check mode to check for file hash equality
* Can sync to and from network, eg two different cloud accounts
* Optional encryption (Crypt)

## Create Docker Container

```
docker create \
--name=rclone.radarr \
-p 8084:8084 \
-v /home/user/mount/.local/encrypted_movie_folder:/source_folder \
-v /home/user/.config/rclone:/config \
-v /home/user/docker/containers/rclone.radarr/logs:/logs \
-e SYNC_COMMAND="rclone sync -v /source_folder/ gdrive:cb/encrypted_movie_folder --size-only" \
walthowd/docker-rclone
```

**Parameters**

* `-v /config` The path where the rclone.conf file is
* `-v /source_folder` The path to the data which should be backed up by Rclone
* `-e SYNC_COMMAND` A custom rclone command $SYNC_DESTINATION:/$SYNC_DESTINATION_SUBPATH


**Starting rclone sync command inside docker container**

To start kick off the rclone move process inside this container simply perform a GET request to the container's `/rclone_sync` endpoint`.

If you `--link` this rclone container inside the actual radarr/sonarr container then you can trigger the rclone process with a post processing webhook in radarr/sonarr.

For example.  Start start the radarr container like this:
```
docker rm -fv radarr; docker run -d \
--name=radarr \
--link rclone.radarr:rclone.radarr \
.
.
.
```

Then you quickly build a post-processing script inside the radarr container the performs a GET request to start rclone sync.

```
#!/bin/bash
eval "curl -i rclone.radarr:8084/rclone_sync"
exit
```

## Info

* Shell access whilst the container is running: `docker exec -it Rclone /bin/ash`
* Upgrade to the latest version: `docker restart Rclone`
* To monitor the logs of the container in realtime: `docker logs -f Rclone`

## Versions
+ **2019/03/19:**
  * Forked to clean up, fixed volume mappings and HTTP methods
  
+ **2017/01/25:**
  * Initial release
