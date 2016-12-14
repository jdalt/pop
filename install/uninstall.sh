#!/usr/bin/env sh

sudo launchctl unload cx.pop.popd.plist
sudo launchctl unload cx.pop.firewall.plist

sudo rm *.plist && sudo rm dev
