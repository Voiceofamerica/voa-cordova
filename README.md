
# Voice Of America Mandarin App

## Download the App
* ...

## Pre-requisites

* NodeJS LTS (Download)[https://nodejs.org/en/]
* If you have a globally installed version of Cordova, uninstall.
* protected.zip password
* (iOS only) Cocoapods (Download)[https://cocoapods.org/app] or (CLI instructions)[https://guides.cocoapods.org/using/getting-started]

## Quickstart

To set up:
* `npm install`
* `npm run protected:unzip`
* `npm run cordova:prepare`
> If you encounter plugin installation errors, re-run `npm run cordova:prepare` until you get no errors

To build & run:
* `npm run start:web` - to run in the browser
* `npm run start:android` - to run in an Android emulator or device
* `npm run start:ios` - to run in an iOS emulator or device

For CI:
* `npm run build`

To Publish:
* In Xcode, select the project, switch to Build Phases tab, add new script
```
set -e
bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/PsiphonTunnel.framework/strip-frameworks.sh"
```

### NOTE
If you don't have access to the protected.zip password, or if you're forking this to create your own app, the contents of protected.zip are:
* `src/psiphon_config.json` - config file for `psiphon-cordova-plugin`
* `static/ADBMobileConfig.json` - config file for `adobe-mobile-services`
* `assets/android/google-services.json` - config file for android plaform of `phonegap-plugin-push`
* `assets/ios/GoogleService-Info.plist` - config file for iOS platform of `phonegap-plugin-push`
