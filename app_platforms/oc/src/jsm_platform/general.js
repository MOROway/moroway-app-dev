"use strict";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";
document.addEventListener("deviceready", function () {
    window.plugins.webintent.onNewIntent(function (url) {
        followLink(url, "", LinkStates.Intent);
    });
});
