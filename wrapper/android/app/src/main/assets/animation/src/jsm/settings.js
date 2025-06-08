/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { setSettingsHTML } from "./common/settings.js";
import { setHTMLStrings } from "./common/string_tools.js";
import { initTooltips } from "./common/tooltip.js";
import { followLink, LinkStates } from "./common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    setHTMLStrings();
    initTooltips();
});
document.addEventListener("DOMContentLoaded", function () {
    setSettingsHTML(document.querySelector("main"), true);
    document.querySelector("#backOption").addEventListener("click", function () {
        try {
            window.close();
        }
        catch (err) { }
        followLink("./", "_self", LinkStates.InternalHtml);
    });
});
