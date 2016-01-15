#!/usr/bin/sh

launchctl unload ~/Library/LaunchAgents/cx.pow.powd.plist # take pow dns and http proxy out of the game
sudo cp dev /etc/resolver/
cp ../config/ports_example.json ../config/ports.json
