#!/bin/sh

VERSION=`cat config.xml | grep -E 'version\s*= ' | sed -e 's,^.*= *",,' -e 's,">.*$,,'`
DATE=`date '+%s'`
GITHASH=`git log -1 | grep -E '^commit' | cut -d' ' -f2`

echo "CACHE MANIFEST" > cruisemonkey.manifest
echo "# version $VERSION $DATE $GITHASH" >> cruisemonkey.manifest
echo "" >> cruisemonkey.manifest

echo "CACHE:" >> cruisemonkey.manifest
find * -type f | grep -vE '^(generate-manifest.sh|cruisemonkey.manifest)$' | while read LINE; do
	echo "$LINE" >> cruisemonkey.manifest
done
echo "" >> cruisemonkey.manifest

echo "NETWORK:" >> cruisemonkey.manifest
echo "*" >> cruisemonkey.manifest
