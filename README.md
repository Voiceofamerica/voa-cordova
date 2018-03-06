
# Voice Of America Mandarin App

## Pre-requisites

* NodeJS LTS (Download)[https://nodejs.org/en/]
* If you have a globally installed version of Cordova, uninstall.
* src/psiphon_config.json
* static/ADBMobileConfig.json

## Quickstart

To set up:
* `npm install`
* `cordova prepare`
> If you encounter plugin installation errors, re-run `cordova prepare` until you get no errors

To build & run:
* `npm run start:web` - to run in the browser
* `npm run start:android` - to run in an Android emulator or device
* `npm run start:ios` - to run in an iOS emulator or device

For CI:
* `npm run build`
