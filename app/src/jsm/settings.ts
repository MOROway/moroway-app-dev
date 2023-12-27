"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "{{jsm_platform}}/common/follow_links.js";
import {setHTMLStrings} from "./common/string_tools.js";
import {setSettingsHTML} from "./common/settings.js";

document.addEventListener("DOMContentLoaded", setHTMLStrings);

window.addEventListener("load", function () {
    setSettingsHTML(document.querySelector("main"), true);
    (document.querySelector("#backOption") as HTMLElement).addEventListener("click", function () {
        try {
            window.close();
        } catch (err) {}
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });
});
