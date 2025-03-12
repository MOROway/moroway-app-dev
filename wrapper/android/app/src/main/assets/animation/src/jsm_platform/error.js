/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", function () {
                WebJSInterface.goBack();
            });
        }
    }
});
