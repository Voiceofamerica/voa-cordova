cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-wheel-selector-plugin.plugin",
    "file": "plugins/cordova-wheel-selector-plugin/www/selectorplugin.js",
    "pluginId": "cordova-wheel-selector-plugin",
    "clobbers": [
      "SelectorCordovaPlugin"
    ],
    "runs": true
  },
  {
    "id": "adobe-mobile-services.ADB",
    "file": "plugins/adobe-mobile-services/sdks/Cordova/ADBMobile/Shared/ADB_Helper.js",
    "pluginId": "adobe-mobile-services",
    "clobbers": [
      "ADB"
    ]
  },
  {
    "id": "psiphon-cordova-plugin.psiphon",
    "file": "plugins/psiphon-cordova-plugin/www/psiphon.js",
    "pluginId": "psiphon-cordova-plugin",
    "clobbers": [
      "psiphon"
    ]
  },
  {
    "id": "cordova-plugin-fullscreen.AndroidFullScreen",
    "file": "plugins/cordova-plugin-fullscreen/www/AndroidFullScreen.js",
    "pluginId": "cordova-plugin-fullscreen",
    "clobbers": [
      "AndroidFullScreen"
    ]
  },
  {
    "id": "ionic-plugin-keyboard.keyboard",
    "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
    "pluginId": "ionic-plugin-keyboard",
    "clobbers": [
      "cordova.plugins.Keyboard"
    ],
    "runs": true
  },
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "cordova-plugin-x-socialsharing.SocialSharing",
    "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
    "pluginId": "cordova-plugin-x-socialsharing",
    "clobbers": [
      "window.plugins.socialsharing"
    ]
  },
  {
    "id": "cordova-pdf-generator.pdf",
    "file": "plugins/cordova-pdf-generator/www/pdf.js",
    "pluginId": "cordova-pdf-generator",
    "clobbers": [
      "cordova.plugins.pdf",
      "pugin.pdf",
      "pdf"
    ]
  },
  {
    "id": "cordova-hot-code-push-plugin.chcp",
    "file": "plugins/cordova-hot-code-push-plugin/www/chcp.js",
    "pluginId": "cordova-hot-code-push-plugin",
    "clobbers": [
      "chcp"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-splashscreen": "4.0.3",
  "cordova-wheel-selector-plugin": "1.0.0",
  "adobe-mobile-services": "4.13.1",
  "psiphon-cordova-plugin": "0.1.0",
  "cordova-plugin-fullscreen": "1.1.0",
  "ionic-plugin-keyboard": "2.2.1",
  "cordova-plugin-crosswalk-webview": "2.3.0",
  "es6-promise-plugin": "4.1.0",
  "cordova-plugin-x-socialsharing": "5.2.1",
  "cordova-pdf-generator": "1.9.3",
  "cordova-plugin-add-swift-support": "1.7.1",
  "cordova-hot-code-push-plugin": "1.5.3"
};
// BOTTOM OF METADATA
});