"use strict";
import { getSetting } from "{{jsm}}/common/settings.js";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";

document.addEventListener("deviceready", function () {
    // Cordova wrapper contains this function
    // @ts-ignore
    window.plugins.webintent.onNewIntent(function (url) {
        followLink(url, "", LinkStates.Intent);
    });
    // The settings live in the web app: apply the landscape lock whenever a page has loaded
    // Cordova wrapper contains this function
    // @ts-ignore
    cordova.lockOrientationLandscape(getSetting("lockOrientationLandscape"));
});
