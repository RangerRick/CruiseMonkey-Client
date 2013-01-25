#!/bin/sh

curl -L -o CruiseMonkey.ipa.new "https://build.phonegap.com/apps/211512/download/ios";      mv CruiseMonkey.ipa.new CruiseMonkey.ipa
curl -L -o CruiseMonkey.xap.new "https://build.phonegap.com/apps/211512/download/winphone"; mv CruiseMonkey.xap.new CruiseMonkey.xap
curl -L -o CruiseMonkey.ipk.new "https://build.phonegap.com/apps/211512/download/webos";    mv CruiseMonkey.ipk.new CruiseMonkey.ipk
curl -L -o CruiseMonkey.apk.new "https://build.phonegap.com/apps/211512/download/android";  mv CruiseMonkey.apk.new CruiseMonkey.apk
curl -L -o CruiseMonkey.wgz.new "https://build.phonegap.com/apps/211512/download/symbian";  mv CruiseMonkey.wgz.new CruiseMonkey.wgz
