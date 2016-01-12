# POP

This is an attempt to make a really well logged and easy to modify tld to port proxy for local development. DISCLAIMER: I have no idea what I'm doing.

## Run

```
./install.sh
npm run dns
npm run proxy
```

Note: the install script will overwrite the `/etc/resolver/dev` file that pow uses and unload pow. You will probably want to rewrite the file `ports.json` with whatever ports you want to proxy to.
