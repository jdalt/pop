#!/usr/bin/env bash

launchctl unload ~/Library/LaunchAgents/cx.pow.powd.plist # take pow dns and http proxy out of the game
sudo cp dev /etc/resolver/
cp ports_example.json ports.json
