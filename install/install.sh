#!/usr/bin/env sh

echo "Calling remote pow uninstall script"
curl get.pow.cx/uninstall.sh | sh

if [ -f /etc/resolver/dev ];
then
  echo "Removing previous dns resolver file at /etc/resolver/dev"
  sudo rm /etc/resolver/dev
fi
sudo cp dev /etc/resolver/

if [ ! -f ../config/ports.json ];
then
  echo "Copied example ports file to ../config/ports.json"
  cp ../config/ports_example.json ../config/ports.json
fi

# remove templated files if they already exist
if [ -f dev ];
then
  sudo rm *.plist && sudo rm dev
fi

nvm use 6.9.2
npm install
./../node_modules/gulp/bin/gulp.js build
sudo chown root *.plist
sudo chgrp wheel *.plist
sudo launchctl load cx.pop.popd.plist
sudo launchctl load cx.pop.firewall.plist
