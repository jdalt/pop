#!/usr/bin/env sh

# launchctl unload ~/Library/LaunchAgents/cx.pow.powd.plist # take pow dns and http proxy out of the game

cp cx.pop.firewall.plist ~/Library/LaunchAgents/cx.pop.firewall.plist # mac firewall/routing rule
sudo chown root ~/Library/LaunchAgents/cx.pop.firewall.plist
sudo chgrp wheel ~/Library/LaunchAgents/cx.pop.firewall.plist
sudo launchctl load ~/Library/LaunchAgents/cx.pop.firewall.plist

sudo mkdir -p /etc/resolver/  && cp dev /etc/resolver/
cp ../config/ports_example.json ../config/ports.json
