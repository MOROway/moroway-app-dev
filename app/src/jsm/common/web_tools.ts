"use strict";
import {followLink, LINK_STATE_NORMAL} from "{{jsm_platform}}/common/follow_links.js";
import {APP_DATA} from "./app_data.js";
import {formatJSString, CURRENT_LANG} from "./string_tools.js";

//HANDLE QUERY String
export function getQueryString(key) {
    var value = "";
    window.location.search
        .substring(1)
        .split("&")
        .forEach(function (part) {
            if (part.indexOf("=") > 0 && part.substring(0, part.indexOf("=")) == key) {
                value = part.substring(part.indexOf("=") + 1);
            }
        });
    return value;
}

//HANDLE LINKS
export function getShareLink(id, key) {
    return formatJSString("{{sharelink}}", id, key);
}
export function getShareLinkServerName() {
    return "{{shareserver}}";
}
export function getServerLink(protocol = PROTOCOL_HTTP) {
    return protocol + "://{{serverlink}}";
}
export function getServerRedirectLink(key) {
    const SERVER_REDIRECT_LINK = getServerLink() + "/redirect_to/index.php";
    return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
export function getServerHTMLLink(key, showCloseButton = "") {
    const SERVER_HTML_LINK = getServerLink() + "/html_content/index.php";
    return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
export function getServerDataLink(path) {
    const SERVER_DATA_LINK = getServerLink() + "/data";
    return SERVER_DATA_LINK + path;
}
export function handleServerJSONValues(key, func) {
    const SERVER_JSON_LINK = getServerLink() + "/json_content/index.php";
    fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG)
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            if (APP_DATA.debug) {
                console.log("Fetch-Error:", error);
            }
        })
        .then(function (response) {
            if (typeof response == "object" && response != null && typeof response.error == "undefined") {
                func(response);
            } else if (APP_DATA.debug) {
                console.log(typeof response != "undefined" && response != null && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
            }
        });
}
export function getServerNote(func) {
    function getServerNoteImage(id, background) {
        return getServerDataLink("/server-note/img/") + id + (background ? "-background-image" : "-image") + ".png";
    }
    const serverNoteLastQuery = window.localStorage.getItem("morowayAppLastServerNoteLastQuery");
    if (serverNoteLastQuery == null || Date.now() - parseInt(serverNoteLastQuery, 10) >= 86400000 || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == "1") {
        window.localStorage.setItem("morowayAppLastServerNoteLastQuery", Date.now().toString());
        handleServerJSONValues("news-msg", function (serverMsg) {
            if (typeof serverMsg == "object" && serverMsg.id != undefined && typeof serverMsg.id == "number" && serverMsg.title != undefined && typeof serverMsg.title == "string" && serverMsg.text != undefined && typeof serverMsg.text == "string" && serverMsg.validUntil != undefined && typeof serverMsg.validUntil == "number" && Date.now() / 1000 <= serverMsg.validUntil && (window.localStorage.getItem("morowayAppLastServerNoteShown") != serverMsg.id || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == "1")) {
                window.localStorage.setItem("morowayAppLastServerNoteShown", serverMsg.id);
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", "0");
                if (serverMsg.image != undefined && serverMsg.image === true) {
                    serverMsg.imageSrc = getServerNoteImage(serverMsg.id, false);
                    delete serverMsg.image;
                }
                if (serverMsg.backgroundImage != undefined && serverMsg.backgroundImage === true) {
                    serverMsg.backgroundImageSrc = getServerNoteImage(serverMsg.id, true);
                    delete serverMsg.backgroundImage;
                }
                func(serverMsg);
            }
        });
    }
}
export function showServerNote() {
    if (document.querySelector("#server-note") != null) {
        getServerNote(function (serverMsg) {
            const serverNoteElementRoot = document.querySelector("#server-note") as HTMLElement;
            const serverNoteElementTitle = document.querySelector("#server-note-title") as HTMLElement;
            const serverNoteElementText = document.querySelector("#server-note-text") as HTMLElement;
            const serverNoteElementLater = document.querySelector("#server-note #server-note-later") as HTMLElement;
            const serverNoteElementLaterCheckBox = document.querySelector("#server-note #server-note-later-box") as HTMLInputElement;
            const serverNoteElementButtonNo = document.querySelector("#server-note #server-note-button-no") as HTMLElement;
            const serverNoteElementButtonGo = document.querySelector("#server-note #server-note-button-go") as HTMLElement;
            const serverNoteElementImageContainer = document.querySelector("#server-note #server-note-img") as HTMLElement;
            const serverNoteElementImage = document.querySelector("#server-note #server-note-img") as HTMLImageElement;
            serverNoteElementRoot.style.display = "block";
            serverNoteElementTitle.textContent = serverMsg.title;
            serverNoteElementText.textContent = serverMsg.text;
            serverNoteElementLaterCheckBox.checked = false;
            serverNoteElementLater.addEventListener("click", function () {
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", serverNoteElementLaterCheckBox.checked ? "1" : "0");
            });
            serverNoteElementButtonNo.addEventListener("click", function () {
                serverNoteElementRoot.style.display = "";
            });
            if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
                serverNoteElementButtonGo.style.display = "block";
                serverNoteElementButtonGo.addEventListener("click", function () {
                    followLink(getServerRedirectLink(serverMsg.link), "_blank", LINK_STATE_NORMAL);
                });
            }
            if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
                serverNoteElementImageContainer.style.display = "flex";
                serverNoteElementImage.src = serverMsg.imageSrc;
                if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                    serverNoteElementImage.style.cursor = "pointer";
                    serverNoteElementImage.addEventListener("click", function () {
                        followLink(getServerRedirectLink(serverMsg.imageLink), "_blank", LINK_STATE_NORMAL);
                    });
                }
            }
            if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
                serverNoteElementRoot.style.backgroundImage = "url(" + serverMsg.backgroundImageSrc + ")";
            }
        });
    }
}

export const PROTOCOL_HTTP = "{{hypertextprotocol}}";
export const PROTOCOL_WS = "{{websocketprotocol}}";
