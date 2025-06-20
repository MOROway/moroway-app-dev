/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "./common/app_data.js";
import { getString, setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltips } from "./common/tooltip.js";
import { getQueryString } from "./common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector("#backOption");
    backButton.addEventListener("click", function () {
        SYSTEM_TOOLS.navigateBack();
    });
    setHTMLStrings();
    initTooltips();
    var elementTitle = document.querySelector("#license-title");
    var elementContent = document.querySelector("#license-content");
    if (elementTitle && elementContent) {
        var file = getQueryString("license-file");
        if ((file.startsWith(document.baseURI) || (!file.startsWith("/") && !file.includes("://"))) && (file.endsWith(".txt") || file.match(/([/]|^)[^.]+$/)) && !file.endsWith("/")) {
            fetch(file)
                .then(function (response) {
                if (response.ok && response.status == 200) {
                    return response.text();
                }
            })
                .then(function (text) {
                if (text) {
                    var textArray = text
                        .replace(/\r\n/g, "\n")
                        .replace(/\r/g, "\n")
                        .replace(/\n\n+/g, "\n\n")
                        .replace(/^\n+/g, "")
                        .split(/[\n]{2}/);
                    for (var i = 0; i < textArray.length; i++) {
                        var currentTextArray = textArray[i].split(/[\n]/);
                        var element2Add = document.createElement("p");
                        for (var i_1 = 0; i_1 < currentTextArray.length; i_1++) {
                            var localElement2AddSpan = document.createElement("span");
                            localElement2AddSpan.textContent = currentTextArray[i_1];
                            element2Add.appendChild(localElement2AddSpan);
                            var localElement2AddBr = document.createElement("br");
                            element2Add.appendChild(localElement2AddBr);
                        }
                        if (i == 0) {
                            elementTitle.appendChild(element2Add);
                        }
                        else {
                            elementContent.appendChild(element2Add);
                        }
                    }
                }
                else {
                    elementTitle.textContent = getString("generalIsFail", "!", "upper");
                    elementContent.textContent = getString("licenseScreenNotFound");
                }
            })
                .catch(function (error) {
                if (APP_DATA.debug) {
                    console.error("Fetch-Error:", error);
                }
                elementTitle.textContent = getString("generalIsFail", "!", "upper");
                elementContent.textContent = getString("licenseScreenNotFound");
            });
        }
    }
});
