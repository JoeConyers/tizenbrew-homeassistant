# tizenbrew-homeassistant

Home Assistant on the Samsung S95H via [TizenBrew](https://github.com/reisxd/TizenBrew),
as a `mods` module: TizenBrew opens the HA URL in the TV's Chromium and injects
`main.js` through the TV's own debugger.

**This directory is the staging copy.** TizenBrew loads modules from jsDelivr, which only
serves **public** GitHub repos (`gh/<user>/<repo>`) or npm packages. `infastructure` is
private, so the files here are pushed to the public repo
`JoeConyers/tizenbrew-homeassistant` (root-level `package.json` + `main.js`).

No secrets live here. Login is a one-time on-TV sign-in as a non-admin `tv` user (the refresh token persists in the WebView)
(see `../../docs/tizenbrew-homeassistant.md`).

## Publish / update

```sh
# one-time
gh repo create JoeConyers/tizenbrew-homeassistant --public --description "Home Assistant TizenBrew module"
# every change
git -C /tmp/tbha pull 2>/dev/null || git clone git@github.com:JoeConyers/tizenbrew-homeassistant /tmp/tbha
cp package.json main.js README.md /tmp/tbha/ && git -C /tmp/tbha add -A && git -C /tmp/tbha commit -m "update" && git -C /tmp/tbha push
```

**Add the module on the TV as `JoeConyers/tizenbrew-homeassistant@main`** — the unversioned `gh/` path resolves to a commit that jsDelivr caches and does not purge; the `@main` path does. After a push, purge with
`curl https://purge.jsdelivr.net/gh/JoeConyers/tizenbrew-homeassistant@main/package.json`
(and `/main.js`), then re-launch the module on the TV.
