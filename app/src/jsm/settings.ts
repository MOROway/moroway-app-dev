"use strict";
import { setSettingsHTML } from "./common/settings.js";
import { setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltips } from "./common/tooltip.js";

document.addEventListener("DOMContentLoaded", function () {
    setHTMLStrings();
    initTooltips();
});

document.addEventListener("DOMContentLoaded", function () {
    const backButton: HTMLElement = document.querySelector("#backOption");
    backButton.addEventListener("click", function () {
        SYSTEM_TOOLS.navigateBack();
    });
    setSettingsHTML(document.querySelector("main"), true);
});
