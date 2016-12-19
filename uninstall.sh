#!/usr/bin/env sh

TEMPLATES=templates/generated

sudo launchctl unload ~/Library/LaunchAgents/github.jdalt.pop.*

sudo rm ~/Library/LaunchAgents/github.jdalt.pop.*
sudo rm $TEMPLATES/*
sudo rm /etc/resolver/dev
rm /usr/local/bin/pop-*
