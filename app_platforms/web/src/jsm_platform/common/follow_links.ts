"use strict";
export function followLink(input1, input2, input3) {
    if (input3 == LINK_STATE_INTERNAL_LICENSE) {
        input1 = "license/?license-file=" + input1;
    } else if (input3 == LINK_STATE_INTERNAL_HTML && !input1.endsWith("/") && input1.indexOf("#") == -1 && input1.indexOf("?") == -1) {
        input1 += "/";
    } else if (input1.indexOf("/#") == -1 && input1.indexOf("#") > -1) {
        input1 = input1.replace(/#/, "/#");
    }
    window.open(input1, input2);
}

export const LINK_STATE_NORMAL = 0;
export const LINK_STATE_INTERNAL_HTML = 1;
export const LINK_STATE_INTERNAL_LICENSE = 3;
