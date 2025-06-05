"use strict";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";

function goBack() {
    followLink("html_platform/start.html", "_self", LinkStates.InternalHtml);
}
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", goBack);
        }
    }
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", goBack, false);
});
