cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-local-notification.LocalNotification",
      "file": "plugins/cordova-plugin-local-notification/www/local-notification.js",
      "pluginId": "cordova-plugin-local-notification",
      "clobbers": [
        "cordova.plugins.notification.local"
      ]
    },
    {
      "id": "cordova-plugin-contacts.contacts",
      "file": "plugins/cordova-plugin-contacts/www/contacts.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "navigator.contacts"
      ]
    },
    {
      "id": "cordova-plugin-contacts.Contact",
      "file": "plugins/cordova-plugin-contacts/www/Contact.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "Contact"
      ]
    },
    {
      "id": "cordova-plugin-contacts.convertUtils",
      "file": "plugins/cordova-plugin-contacts/www/convertUtils.js",
      "pluginId": "cordova-plugin-contacts"
    },
    {
      "id": "cordova-plugin-contacts.ContactAddress",
      "file": "plugins/cordova-plugin-contacts/www/ContactAddress.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactAddress"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactError",
      "file": "plugins/cordova-plugin-contacts/www/ContactError.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactError"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactField",
      "file": "plugins/cordova-plugin-contacts/www/ContactField.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactField"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactFindOptions",
      "file": "plugins/cordova-plugin-contacts/www/ContactFindOptions.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactFindOptions"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactName",
      "file": "plugins/cordova-plugin-contacts/www/ContactName.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactName"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactOrganization",
      "file": "plugins/cordova-plugin-contacts/www/ContactOrganization.js",
      "pluginId": "cordova-plugin-contacts",
      "clobbers": [
        "ContactOrganization"
      ]
    },
    {
      "id": "cordova-plugin-contacts.ContactFieldType",
      "file": "plugins/cordova-plugin-contacts/www/ContactFieldType.js",
      "pluginId": "cordova-plugin-contacts",
      "merges": [
        ""
      ]
    },
    {
      "id": "cordova-plugin-android-permissions.Permissions",
      "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
      "pluginId": "cordova-plugin-android-permissions",
      "clobbers": [
        "cordova.plugins.permissions"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-device": "3.0.0",
    "cordova-plugin-local-notification": "1.1.7",
    "cordova-plugin-contacts": "3.0.1",
    "cordova-plugin-android-permissions": "1.1.5"
  };
});