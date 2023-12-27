"use strict";
import {followLink, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL} from "./common/follow_links.js";
import {handleServerJSONValues} from "../jsm/common/web_tools.js";
document.addEventListener("DOMContentLoaded", function () {
    var pics = document.querySelector("#website-pics");
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

    document.querySelector("#legal-appsnap-licenses").classList.remove("hidden");
    document.querySelector("#legal-appsnap-cordova-license").addEventListener("click", function () {
        followLink("licenses_platform/cordova", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
});
