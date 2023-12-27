"use strict";
import {followLink, LINK_STATE_NORMAL} from "./common/follow_links.js";
import {handleServerJSONValues} from "{{jsm}}/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    const pics = document.querySelector("#website-pics") as HTMLElement;
    if (pics) {
        pics.style.display = "none";
        handleServerJSONValues("webpics", function (res) {
            if (typeof res.pics == "object") {
                res.pics.forEach(function (pic) {
                    var img = document.createElement("div");
                    img.onclick = function () {
                        followLink(pic.links.normal, "_blank", LINK_STATE_NORMAL);
                    };
                    img.style.backgroundImage = "url('" + pic.urls.thumb.url + "')";
                    pics.appendChild(img);
                });
                pics.style.display = "";
            }
        });
    }
});
