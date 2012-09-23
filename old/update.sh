#!/bin/bash

MYDIR=`dirname $0`
TOPDIR=`cd $MYDIR; pwd`

pushd "$TOPDIR" >/dev/null 2>&1

#	git pull >update.log 2>&1
#	git submodule init >>update.log 2>&1
#	git submodule update >>update.log 2>&1

	DATE=`date '+%s'`
	GITHASH=`git log -1 | grep -E '^commit' | cut -d' ' -f2`
	
	for FILE in *.in; do
		OUTFILE="${FILE/.in/}"
		sed -e "s,@DATE@,$DATE,g" -e "s,@GITHASH@,$GITHASH,g" "$FILE" > "$OUTFILE"
	done

popd >/dev/null 2>&1
