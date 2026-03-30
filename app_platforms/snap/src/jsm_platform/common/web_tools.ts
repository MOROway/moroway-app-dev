"use strict";
import { LinkStates } from "{{jsm}}/common/web_tools.js";

export function followLink(input1, input2, input3) {
    if (typeof input2 !== "string") {
        input2 = "";
    }
    switch (input3) {
        case LinkStates.External:
            // Electron wrapper contains this function
            // @ts-ignore
            _openExternalLink.exec(input1);
            break;
        case LinkStates.InternalHtml:
            var hash, queryString;
            if (input1.includes("#")) {
                hash = input1.substring(input1.indexOf("#"));
                input1 = input1.substring(0, input1.indexOf("#"));
            }
            if (input1.includes("?")) {
                queryString = input1.substring(input1.indexOf("?"));
                input1 = input1.substring(0, input1.indexOf("?"));
            }
            input1 = input1.length == 0 ? "./index.html" : input1.endsWith("/") ? input1 + "index.html" : input1.endsWith(".html") ? input1 : input1 + "/index.html";
            if (queryString !== undefined) {
                input1 += queryString;
            }
            if (hash !== undefined) {
                input1 += hash;
            }
            if (input2 === "_self") {
                window.location.href = input1;
            } else {
                // Electron wrapper contains this function
                // @ts-ignore
                _openNormalLink.exec(input1);
            }
            break;
        case LinkStates.InternalLicense:
            followLink("license/?license-file=" + input1, input2, LinkStates.InternalHtml);
            break;
    }
}
