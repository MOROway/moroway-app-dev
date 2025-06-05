"use strict";
import { LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE } from "{{jsm}}/common/web_tools.js";

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
    input2 = input2.replace(/\s/g, "");
    if (input2 === "") {
        window.open(input1);
    } else {
        window.open(input1, input2);
    }
}
