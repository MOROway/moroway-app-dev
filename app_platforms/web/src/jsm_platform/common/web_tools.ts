"use strict";
import { LinkStates } from "{{jsm}}/common/web_tools.js";

export function followLink(input1, input2, input3) {
    if (input3 == LinkStates.InternalLicense) {
        input1 = "license/?license-file=" + input1;
    } else if (input3 == LinkStates.InternalHtml && !input1.endsWith("/") && !input1.includes("#") && !input1.includes("?")) {
        input1 += "/";
    } else if (!input1.includes("/#") && input1.includes("#")) {
        input1 = input1.replace(/#/, "/#");
    }
    if (typeof input2 !== "string") {
        input2 = "";
    }
    input2 = input2.replace(/\s/g, "");
    if (input2 === "") {
        window.open(input1);
    } else {
        window.open(input1, input2);
    }
}
