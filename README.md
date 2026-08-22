# tizenbrew-homeassistant

Home Assistant on the Samsung S95H via [TizenBrew](https://github.com/reisxd/TizenBrew),
as a `mods` module: TizenBrew opens the HA URL in the TV's Chromium and injects
`main.js` through the TV's own debugger.

**This directory is the staging copy.** TizenBrew loads modules from jsDelivr, which only
serves **public** GitHub repos (`gh/<user>/<repo>`) or npm packages. `infastructure` is
private, so the files here are pushed to the public repo
`JoeConyers/tizenbrew-homeassistant` (root-level `package.json` + `main.js`).

No secrets live here. Login is handled by HA's `trusted_networks` auth provider
(see `../../docs/tizenbrew-homeassistant.md`).

## Publish / update

```sh
# one-time
gh repo create JoeConyers/tizenbrew-homeassistant --public --description "Home Assistant TizenBrew module"
# every change
git -C /tmp/tbha pull 2>/dev/null || git clone git@github.com:JoeConyers/tizenbrew-homeassistant /tmp/tbha
cp package.json main.js README.md /tmp/tbha/ && git -C /tmp/tbha add -A && git -C /tmp/tbha commit -m "update" && git -C /tmp/tbha push
```

jsDelivr caches `gh/` content; after a push, purge with
`curl https://purge.jsdelivr.net/gh/JoeConyers/tizenbrew-homeassistant/package.json`
(and `/main.js`), then re-launch the module on the TV.
