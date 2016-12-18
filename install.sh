#!/usr/bin/env sh

TEMPLATES=templates/generated

# Uninstall pow if there's a plist entry
if [ -f ~/Library/LaunchAgents/cx.pow.powd.plist ];
then
  echo "Calling remote pow uninstall script"
  curl get.pow.cx/uninstall.sh | sh
fi

# Copy ports from example file if none exist
if [ ! -f config/ports.yml ];
then
  echo "Copied example ports file to config/ports.yml"
  cp config/ports_example.yml config/ports.yml
fi

# Remove templated files if they already exist
if [ -f $TEMPLATES/github.jdalt.pop.popd.plist ];
then
  sudo rm -r $TEMPLATES/
fi

# Generate plist and resolver from Templates
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # load nvm
nvm install 6.9.2 # installs (if missing) and switches node version
npm install
./node_modules/gulp/bin/gulp.js build

# Permission daemons to root:wheel
sudo chown root:wheel $TEMPLATES/*.plist

# Move to LaunchAgents and start
sudo ln -sfv $PWD/$TEMPLATES/*.plist ~/Library/LaunchAgents
sudo launchctl load ~/Library/LaunchAgents/github.jdalt.pop.*

# Copy Resolver if it doesn't exist
if [ -f /etc/resolver/dev ];
then
  echo "Removing previous dns resolver file at /etc/resolver/dev"
  sudo rm /etc/resolver/dev
fi
sudo cp $TEMPLATES/dev /etc/resolver/
