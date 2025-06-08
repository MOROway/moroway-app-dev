"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { LinkStates } from "{{jsm}}/common/web_tools.js";

export function followLink(input1, input2, input3) {
    if ((input3 === LinkStates.InternalHtml || input3 === LinkStates.InternalReload) && input1.match(/[.][A-Za-z0-9]+([?]|#|$)/) === null) {
        if (input1.startsWith("?") || input1.startsWith("#")) {
            input1 = "./" + input1;
        } else if (input1.includes("?") && !input1.includes("/?")) {
            input1 = input1.replace(/[?]/, "/?");
        } else if (input1.includes("#") && !input1.includes("/#")) {
            input1 = input1.replace(/#/, "/#");
        } else if (input1 === "") {
            input1 = "./";
        } else if (!input1.endsWith("/")) {
            input1 += "/";
        }
    }
    if (input3 === LinkStates.InternalReload) {
        if (input1 === window.location.href) {
            window.location.reload();
            return;
        } else {
            try {
                window.location.replace(input1);
                return;
            } catch (error) {
                if (APP_DATA.debug) {
                    console.error(error);
                }
            }
        }
    } else if (input3 === LinkStates.InternalLicense) {
        input1 = "license/?license-file=" + input1;
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
