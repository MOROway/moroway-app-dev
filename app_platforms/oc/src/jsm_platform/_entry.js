"use strict";
import { followLink, LINK_STATE_INTENT } from "{{jsm}}/common/web_tools.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.getUri(function (url) {
        followLink(url, "", LINK_STATE_INTENT);
    }, false);
});
