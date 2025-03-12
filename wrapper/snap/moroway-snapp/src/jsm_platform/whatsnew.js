/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", function () {
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
        }
    }
});
