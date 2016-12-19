# POP

This is an attempt to make a really well logged and easy to modify tld to port proxy for local development.

## Install
---

```
./install.sh
```

The installer will **uninstall Pow** and create 1) a resolver for `dev` 2) a mac firewall rule to push all port 80 traffic to 20558 and 3) a dns and http server which will proxy traffic according to `config/ports.yml`. This will happen automatically in the background.

To stop the pop launch agents you can run `sudo launchctl unload ~/Library/LaunchAgents/github.jdalt.pop.*`.


## Ports
---
An example file is written to `ports.yml` and excluded from version control. Modifications to this file are watched by the http server and picked within about 1 secound from changes. The changes are logged.


## Logging
---
One of the chief advantages of using Pop is its dynamic logging. Both the Dns and Proxy server log to `log/dns.log` and `log/proxy.log` respectively.

## /usr/local/bin
3 scripts are linked into /usr/local/bin to make reading the logs easier: `pop-tail-proxy-log`, `pop-tail-dns-log`, and `pop-format-log`. You can run `pop-tail-proxy-log | pop-format-log` for fancified logs.
