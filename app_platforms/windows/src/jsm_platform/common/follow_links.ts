"use strict";
export function followLink(input1, input2, input3) {
    if (input3 == LINK_STATE_INTERNAL_LICENSE) {
        input1 = "license/?license-file=" + input1;
    } else if (input3 == LINK_STATE_INTERNAL_HTML) {
        var hash, queryString;
        if (input1.includes("#")) {
            hash = input1.substr(input1.indexOf("#"));
            input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
        }
        if (input1.includes("?")) {
            queryString = input1.substr(input1.indexOf("?"));
            input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("?")));
        }
        if (!input1.endsWith("/") && !input1.endsWith(".html")) {
            input1 += input1.length == 0 ? "./" : "/";
        }
        if (queryString !== undefined) {
            input1 += queryString;
        }
        if (hash !== undefined) {
            input1 += hash;
        }
    }
    window.open(input1, input2);
}

export const LINK_STATE_NORMAL = 0;
export const LINK_STATE_INTERNAL_HTML = 1;
export const LINK_STATE_INTERNAL_LICENSE = 3;
