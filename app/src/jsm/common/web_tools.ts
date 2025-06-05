"use strict";
import { followLink } from "{{jsm_platform}}/common/web_tools.js";
import { APP_DATA } from "./app_data.js";
import { CURRENT_LANG, formatJSString, getString } from "./string_tools.js";
export { followLink } from "{{jsm_platform}}/common/web_tools.js";

//HANDLE QUERY String
export function getQueryString(key: string): string {
    var value = "";
    window.location.search
        .substring(1)
        .split("&")
        .forEach(function (part) {
            if (part.indexOf("=") > 0 && part.substring(0, part.indexOf("=")) === key) {
                value = part.substring(part.indexOf("=") + 1);
            }
        });
    return value;
}

//HANDLE LINKS
export function getShareLink(id: string, key: string): string {
    return formatJSString("{{sharelink}}", id, key);
}
export function getShareLinkServerName(): string {
    return "{{shareserver}}";
}
export function getServerLink(protocol: string = PROTOCOL_HTTP): string {
    return protocol + "://{{serverlink}}";
}
export function getServerRedirectLink(key: string): string {
    const SERVER_REDIRECT_LINK = getServerLink() + "/redirect_to/index.php";
    return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
export function getServerHTMLLink(key: string): string {
    const SERVER_HTML_LINK = getServerLink() + "/html_content/index.php";
    return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=auto";
}
export function getServerDataLink(path: string): string {
    const SERVER_DATA_LINK = getServerLink() + "/data";
    return SERVER_DATA_LINK + path;
}
export function handleServerJSONValues(key: string, func: (response: any) => void): void {
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
export function getServerNote(func: (response: any) => void): void {
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
export function showServerNote(serverNoteElementRoot: HTMLElement): void {
    getServerNote(function (serverMsg) {
        function styleShowAgain() {
            window.localStorage.setItem("morowayAppLastServerNoteShowAgain", showAgain ? "1" : "0");
            serverNoteElementLaterCheckBox.textContent = showAgain ? "check_box" : "check_box_outline_blank";
        }
        var showAgain = false;

        serverNoteElementRoot.classList.add("server-note");
        const serverNoteElementMain = document.createElement("div");
        serverNoteElementMain.className = "server-note-main";
        const serverNoteElementTitle = document.createElement("div");
        serverNoteElementTitle.className = "server-note-title";
        serverNoteElementTitle.textContent = serverMsg.title;
        const serverNoteElementInner = document.createElement("div");
        serverNoteElementInner.className = "server-note-inner";
        const serverNoteElementText = document.createElement("div");
        serverNoteElementText.className = "server-note-text";
        serverNoteElementText.textContent = serverMsg.text;
        const serverNoteElementImageContainer = document.createElement("div");
        serverNoteElementImageContainer.className = "server-note-img";
        const serverNoteElementImage = document.createElement("img");
        const serverNoteElementLater = document.createElement("div");
        serverNoteElementLater.className = "server-note-later";
        const serverNoteElementLaterCheckBox = document.createElement("i");
        serverNoteElementLaterCheckBox.className = "server-note-later-box material-icons";
        const serverNoteElementLaterCheckBoxLabel = document.createElement("span");
        serverNoteElementLaterCheckBoxLabel.textContent = getString("generalServerNoteButtonLater");
        const serverNoteElementLaterInfo = document.createElement("div");
        serverNoteElementLaterInfo.className = "server-note-later-info";
        serverNoteElementLaterInfo.textContent = getString("generalServerNoteInfoLater");
        const serverNoteElementButtons = document.createElement("div");
        serverNoteElementButtons.className = "server-note-buttons";
        const serverNoteElementButtonGo = document.createElement("div");
        serverNoteElementButtonGo.className = "server-note-button-go";
        serverNoteElementButtonGo.textContent = getString("generalServerNoteButtonGo", "", "upper");
        const serverNoteElementButtonNo = document.createElement("div");
        serverNoteElementButtonNo.className = "server-note-button-no";
        serverNoteElementButtonNo.textContent = getString("generalOK", "", "upper");

        styleShowAgain();
        serverNoteElementLater.onclick = function () {
            showAgain = !showAgain;
            styleShowAgain();
        };
        if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
            serverNoteElementButtonGo.style.display = "block";
            serverNoteElementButtonGo.onclick = function () {
                followLink(getServerRedirectLink(serverMsg.link), "_blank", LINK_STATE_NORMAL);
            };
        }
        serverNoteElementButtonNo.onclick = function () {
            serverNoteElementRoot.style.display = "";
        };
        if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
            serverNoteElementImageContainer.style.display = "flex";
            serverNoteElementImage.src = serverMsg.imageSrc;
            if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                serverNoteElementImage.style.cursor = "pointer";
                serverNoteElementImage.onclick = function () {
                    followLink(getServerRedirectLink(serverMsg.imageLink), "_blank", LINK_STATE_NORMAL);
                };
            }
        }
        if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
            serverNoteElementRoot.style.backgroundImage = "url(" + serverMsg.backgroundImageSrc + ")";
        }

        serverNoteElementMain.appendChild(serverNoteElementTitle);
        serverNoteElementInner.appendChild(serverNoteElementText);
        serverNoteElementImageContainer.appendChild(serverNoteElementImage);
        serverNoteElementInner.appendChild(serverNoteElementImageContainer);
        serverNoteElementLater.appendChild(serverNoteElementLaterCheckBox);
        serverNoteElementLater.appendChild(serverNoteElementLaterCheckBoxLabel);
        serverNoteElementInner.appendChild(serverNoteElementLater);
        serverNoteElementInner.appendChild(serverNoteElementLaterInfo);
        serverNoteElementButtons.appendChild(serverNoteElementButtonGo);
        serverNoteElementButtons.appendChild(serverNoteElementButtonNo);
        serverNoteElementInner.appendChild(serverNoteElementButtons);
        serverNoteElementMain.appendChild(serverNoteElementInner);
        serverNoteElementRoot.appendChild(serverNoteElementMain);

        serverNoteElementRoot.style.display = "block";
    });
}

export const PROTOCOL_HTTP = "{{hypertextprotocol}}";
export const PROTOCOL_WS = "{{websocketprotocol}}";

export const LINK_STATE_NORMAL = 0;
export const LINK_STATE_INTERNAL_HTML = 1;
export const LINK_STATE_INTERNAL_LICENSE = 2;
export const LINK_STATE_INTENT = 4;
