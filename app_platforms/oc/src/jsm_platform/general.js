"use strict";
import { followLink, LINK_STATE_INTENT } from "{{jsm}}/common/web_tools.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.onNewIntent(function (url) {
        followLink(url, "", LINK_STATE_INTENT);
    });
});
