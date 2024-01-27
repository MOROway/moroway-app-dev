"use strict";
import {followLink, LINK_STATE_INTERNAL_LICENSE} from "./common/follow_links.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#legal-appsnap-licenses").classList.remove("hidden");
    document.querySelector("#legal-appsnap-cordova-license").addEventListener("click", function () {
        followLink("licenses_platform/cordova", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
});
