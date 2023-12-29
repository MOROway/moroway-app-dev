"use strict";
export function followLink(input1, input2, input3) {
    var followLink = true;
    switch (input3) {
        case LINK_STATE_NORMAL:
            break;
        case LINK_STATE_INTERNAL_HTML:
            var hash, queryString;
            if (input1.indexOf("#") != -1) {
                hash = input1.substr(input1.indexOf("#"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
            }
            if (input1.indexOf("?") != -1) {
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
        case LINK_STATE_INTERNAL_LICENSE:
            input1 = "./license/index.html?license-file=" + input1;
            break;
        case LINK_STATE_INTERNAL_LICENSE_FILE:
            history.replaceState(null, "", input1);
            location.reload();
            return;
    }
    if (followLink) {
        window.open(input1, input2);
    }
}

export const LINK_STATE_NORMAL = 0;
export const LINK_STATE_INTERNAL_HTML = 1;
export const LINK_STATE_INTERNAL_LICENSE_FILE = 2;
export const LINK_STATE_INTERNAL_LICENSE = 3;
