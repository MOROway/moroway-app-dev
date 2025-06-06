"use strict";
import { getString, setHTMLStrings } from "./common/string_tools.js";
import { initTooltips } from "./common/tooltip.js";
import { followLink, LinkStates } from "./common/web_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    (document.querySelector("#backOption") as HTMLElement).addEventListener("click", function () {
        followLink("./", "_self", LinkStates.InternalHtml);
    });

    var elements = document.querySelectorAll(".content") as NodeListOf<HTMLElement>;
    for (var i = 0; i < elements.length; i++) {
        var elemString = elements[i].dataset.stringidContent;
        var j = 0;
        do {
            if (elemString && getString([elemString, j]) != "undefined") {
                var subElement = document.createElement("p");
                subElement.setAttribute("data-stringid-content", elemString);
                subElement.setAttribute("data-stringid-content-arrayno", j.toString());
                elements[i].appendChild(subElement);
                j++;
            } else {
                j = 0;
            }
        } while (j > 0);
        elements[i].removeAttribute("data-stringid-content");
    }
    setHTMLStrings();
    initTooltips();
});
