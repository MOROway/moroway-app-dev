"use strict";
import { followLink, LINK_STATE_INTERNAL_LICENSE } from "{{jsm}}/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#legal-appsnap-licenses").classList.remove("hidden");
    document.querySelector("#legal-appsnap-electron-builder-license").addEventListener("click", function () {
        followLink("licenses_platform/electron-builder", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appsnap-electron-license").addEventListener("click", function () {
        followLink("licenses_platform/electron", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
});
