"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "{{jsm_platform}}/common/follow_links.js";
import {APP_DATA} from "./common/app_data.js";
import {getQueryString} from "./common/web_tools.js";
import {getString, setHTMLStrings} from "./common/string_tools.js";
import {initTooltips} from "./common/tooltip.js";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#backOption")?.addEventListener("click", function () {
        followLink("help", "_self", LINK_STATE_INTERNAL_HTML);
    });

    setHTMLStrings();
    initTooltips();

    const elementTitle = document.querySelector("#license-title");
    const elementContent = document.querySelector("#license-content");
    if (elementTitle && elementContent) {
        const file = getQueryString("license-file");
        if ((file.startsWith(document.baseURI) || (!file.startsWith("/") && file.indexOf("://") == -1)) && (file.endsWith(".txt") || file.match(/([/]|^)[^.]+$/)) && !file.endsWith("/")) {
            fetch(file)
                .then(function (response) {
                    if (response.ok && response.status == 200) {
                        return response.text();
                    }
                })
                .then(function (text) {
                    if (text) {
                        const textArray = text
                            .replace(/\r\n/g, "\n")
                            .replace(/\r/g, "\n")
                            .replace(/\n\n+/g, "\n\n")
                            .replace(/^\n+/g, "")
                            .split(/[\n]{2}/);
                        for (let i = 0; i < textArray.length; i++) {
                            var currentTextArray = textArray[i].split(/[\n]/);
                            var element2Add = document.createElement("p");
                            for (let i = 0; i < currentTextArray.length; i++) {
                                var localElement2AddSpan = document.createElement("span");
                                localElement2AddSpan.textContent = currentTextArray[i];
                                element2Add.appendChild(localElement2AddSpan);
                                var localElement2AddBr = document.createElement("br");
                                element2Add.appendChild(localElement2AddBr);
                            }
                            if (i == 0) {
                                elementTitle.appendChild(element2Add);
                            } else {
                                elementContent.appendChild(element2Add);
                            }
                        }
                    } else {
                        elementTitle.textContent = getString("generalIsFail", "!", "upper");
                        elementContent.textContent = getString("licenseScreenNotFound");
                    }
                })
                .catch(function (error) {
                    if (APP_DATA.debug) {
                        console.log("Fetch-Error:", error);
                    }
                    elementTitle.textContent = getString("generalIsFail", "!", "upper");
                    elementContent.textContent = getString("licenseScreenNotFound");
                });
        }
    }
});
