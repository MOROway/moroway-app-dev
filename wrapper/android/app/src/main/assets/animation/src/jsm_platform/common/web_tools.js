/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { LinkStates } from "../../jsm/common/web_tools.js";
export function followLink(input1, input2, input3) {
    var followLink = true;
    switch (input3) {
        case LinkStates.External:
            break;
        case LinkStates.InternalHtml:
            var hash, queryString;
            if (input1.includes("#")) {
                hash = input1.substr(input1.indexOf("#"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
            }
            if (input1.includes("?")) {
                queryString = input1.substr(input1.indexOf("?"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("?")));
            }
            input1 = input1.length == 0 ? "./index.html" : input1.substr(input1.length - 1, 1) == "/" ? input1 + "index.html" : input1.substr(input1.length - 5, 5) == ".html" ? input1 : input1 + "/index.html";
            if (queryString !== undefined) {
                input1 += queryString;
            }
            if (hash !== undefined) {
                input1 += hash;
            }
            break;
        case LinkStates.InternalLicense:
            input1 = "./license/index.html?license-file=" + input1;
            break;
    }
    if (followLink) {
        if (typeof input2 !== "string") {
            input2 = "";
        }
        input2 = input2.replace(/\s/g, "");
        if (input2 === "") {
            window.open(input1);
        }
        else {
            window.open(input1, input2);
        }
    }
}
