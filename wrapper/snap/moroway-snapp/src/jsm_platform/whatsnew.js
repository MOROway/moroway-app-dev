/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
window.addEventListener("load", function () {
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function () {
        (async () => {
            if (await _canGoBack.exec()) {
                _goBack.exec();
            } else {
                try {
                    window.close();
                } catch (err) {
                    followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
                }
            }
        })();
    });
});
