
# Voice Of America Farsi App

## Download the App
* ...

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

To Publish to TestFlight:
* In XCode, select the project, switch to Build Phases tab, add new script
```
set -e
bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/PsiphonTunnel.framework/strip-frameworks.sh"
```
* In XCode, run `Product -> Archive`
  - Validate the archive
    - Strip and upload symbols _(both boxes checked on first screen)_
    - Have XCode manage signing _(top radio button checked on second screen)_
  - **If and only if validation succeeds** hit "Upload to App Store..." button
    - Strip and upload symbols _(both boxes checked on first screen)_
    - Have XCode manage signing _(top radio button checked on second screen)_
* Go to [iTunes Connect -> My Apps](https://itunesconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app)
  - Select appropriate app
  - Select the "TestFlight" tab
    - If you don't see your build, it may still be processing
    - You can check on its status in the "Activity" tab
    - If it's processing, wait until it completes (will take 5 - 10 minutes)
  - From the "TestFlight" tab
    - Open your build version
    - If it has a green circle and says "Testing", you're good to go
    - It may require export compliance information:
      1. Does your app use encryption? Select Yes even if your app only uses the standard encryption in iOS and macOS.
        - Yes
      2. Does your app qualify for any of the exemptions provided in Category 5, Part 2 of the U.S. Export Administration Regulations?
        - Yes
