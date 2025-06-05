"use strict";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#legal-appsnap-licenses").classList.remove("hidden");
    document.querySelector("#legal-appsnap-electron-builder-license").addEventListener("click", function () {
        followLink("licenses_platform/electron-builder", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appsnap-electron-license").addEventListener("click", function () {
        followLink("licenses_platform/electron", "_self", LinkStates.InternalLicense);
    });
});
