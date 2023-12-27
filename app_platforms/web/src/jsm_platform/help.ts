"use strict";
import {followLink, LINK_STATE_NORMAL} from "./common/follow_links.js";
import {getServerRedirectLink} from "{{jsm}}/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    (document.querySelector("#download-androidlink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_android"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-fdroidlink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_fdroid"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-windowslink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_windows"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-snaplink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_snap"), "_blank", LINK_STATE_NORMAL);
    });
});
