#!/usr/bin/env sh

TEMPLATES=templates/generated

# Uninstall pow if there's a plist entry
if [ -f ~/Library/LaunchAgents/cx.pow.powd.plist ];
then
  echo "Calling remote pow uninstall script"
  curl get.pow.cx/uninstall.sh | sh
fi

# Copy settings from example file if none exist
if [ ! -f config/settings.js ];
then
  cp templates/settings_example.js config/settings.js
  echo "Copied example settings file to config/settings.js"
fi

# Copy ports from example file if none exist
if [ ! -f config/ports.yml ];
then
  cp templates/ports_example.yml config/ports.yml
  echo "Copied example ports file to config/ports.yml"
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

# Fix up permissions...
sudo chown -R $USER $PWD
# ...except permission to root:wheel for the firewall plist
sudo chown root:wheel $TEMPLATES/github.jdalt.pop.firewall.plist

# Symlink plists to LaunchAgents and start
sudo rm -f ~/Library/LaunchAgents/github.jdalt.pop.* /Library/LaunchDaemons/github.jdalt.pop.*
sudo ln -sfv $PWD/$TEMPLATES/github.jdalt.pop.firewall.plist /Library/LaunchDaemons

# Cribbed from Pow
if [ "$(sw_vers -productVersion | awk -F. '{ print $2 }')" -ge 10 ];
then
    sudo launchctl bootstrap system /Library/LaunchDaemons/github.jdalt.pop.firewall.plist 2>/dev/null
    sudo launchctl enable system/github.jdalt.pop.firewall 2>/dev/null
    sudo launchctl kickstart -k system/github.jdalt.pop.firewall 2>/dev/null
else
    sudo launchctl load -Fw /Library/LaunchDaemons/github.jdalt.pop.firewall.plist 2>/dev/null
fi

ln -sfv $PWD/$TEMPLATES/github.jdalt.pop.popd.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/github.jdalt.pop.popd.plist 2>/dev/null

# Copy Resolver if it doesn't exist
if [ -f /etc/resolver/dev ];
then
  echo "Removing previous dns resolver file at /etc/resolver/dev"
  sudo rm /etc/resolver/dev
fi
sudo cp $TEMPLATES/dev /etc/resolver/

echo "tail -F $PWD/log/proxy.log" > bin/pop-tail-proxy-log
echo "tail -F $PWD/log/dns.log" > bin/pop-tail-dns-log
chmod +x bin/pop-tail-proxy-log
chmod +x bin/pop-tail-dns-log
ln -sfv $PWD/bin/pop-* /usr/local/bin
