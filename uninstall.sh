#!/usr/bin/env sh

TEMPLATES=templates/generated

sudo launchctl unload ~/Library/LaunchAgents/cx.pop.*

sudo rm ~/Library/LaunchAgents/cx.pop.*
sudo rm $TEMPLATES/*
sudo rm /etc/resolver/dev
