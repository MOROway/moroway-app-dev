"use strict";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", function () {
                (async () => {
                    // Electron wrapper contains this function
                    // @ts-ignore
                    if (await _canGoBack.exec()) {
                        // Electron wrapper contains this function
                        // @ts-ignore
                        _goBack.exec();
                    } else {
                        try {
                            window.close();
                        } catch (err) {
                            followLink("./", "_self", LinkStates.InternalHtml);
                        }
                    }
                })();
            });
        }
    }
});
