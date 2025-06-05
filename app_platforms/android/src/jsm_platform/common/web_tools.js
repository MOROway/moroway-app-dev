"use strict";
import { LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL } from "{{jsm}}/common/web_tools.js";

export function followLink(input1, input2, input3) {
    var followLink = true;
    switch (input3) {
        case LINK_STATE_NORMAL:
            break;
        case LINK_STATE_INTERNAL_HTML:
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
        case LINK_STATE_INTERNAL_LICENSE:
            input1 = "./license/index.html?license-file=" + input1;
            break;
    }
    if (followLink) {
        input2 = input2.replace(/\s/g, "");
        if (input2 === "") {
            window.open(input1);
        } else {
            window.open(input1, input2);
        }
    }
}
