"use strict";
import { followLink, LINK_STATE_INTERNAL_HTML } from "{{jsm}}/common/web_tools.js";
function goBack() {
    followLink("./help", "_self", LINK_STATE_INTERNAL_HTML);
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
