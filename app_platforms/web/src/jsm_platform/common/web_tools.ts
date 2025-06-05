"use strict";
import { LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE } from "{{jsm}}/common/web_tools.js";

export function followLink(input1, input2, input3) {
    if (input3 == LINK_STATE_INTERNAL_LICENSE) {
        input1 = "license/?license-file=" + input1;
    } else if (input3 == LINK_STATE_INTERNAL_HTML && !input1.endsWith("/") && !input1.includes("#") && !input1.includes("?")) {
        input1 += "/";
    } else if (!input1.includes("/#") && input1.includes("#")) {
        input1 = input1.replace(/#/, "/#");
    }
    input2 = input2.replace(/\s/g, "");
    if (input2 === "") {
        window.open(input1);
    } else {
        window.open(input1, input2);
    }
}
