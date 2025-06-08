/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    var elem = document.getElementById("backOption");
    if (elem) {
        var elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        var elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", function () {
                // Android wrapper contains WebJSInterface
                // @ts-ignore
                WebJSInterface.goBack();
            });
        }
    }
});
