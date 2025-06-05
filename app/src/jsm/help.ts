"use strict";
import { APP_DATA } from "./common/app_data.js";
import { NOTIFICATION_PRIO_DEFAULT, notify } from "./common/notify.js";
import { formatJSString, getString, setHTMLStrings } from "./common/string_tools.js";
import { initTooltips } from "./common/tooltip.js";
import { followLink, getServerHTMLLink, getServerRedirectLink, handleServerJSONValues, LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL } from "./common/web_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    function getUserSystem() {
        const shortStrings = ["Electron", "Edg", "Chrome", "Firefox", "Safari"];
        for (var i = 0; i < shortStrings.length; i++) {
            var index = navigator.userAgent.indexOf(" " + shortStrings[i] + "/");
            if (index != -1) {
                return navigator.userAgent
                    .substring(index + 1)
                    .replace(/ .*/, "")
                    .replace(/[/]/, ", ");
            }
        }
        return navigator.userAgent;
    }
    (document.querySelector("#backOption") as HTMLElement).addEventListener("click", function () {
        try {
            window.close();
        } catch (err) {}
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });

    (document.querySelector("#legal-libraries-threejs-license") as HTMLElement).addEventListener("click", function () {
        followLink("src/lib/open_code/jsm/three.js/LICENSE.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-fonts-roboto-license") as HTMLElement).addEventListener("click", function () {
        followLink("src/lib/open_fonts/google/Roboto/LICENSE.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-fonts-materialicons-license") as HTMLElement).addEventListener("click", function () {
        followLink("src/lib/open_fonts/google/MaterialSymbols/LICENSE.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-media-sound-license-cc0") as HTMLElement).addEventListener("click", function () {
        followLink("assets/CC0-1.0.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-media-3d-models-license-cc-by") as HTMLElement).addEventListener("click", function () {
        followLink("assets/CC-BY-4.0.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-self-code-license") as HTMLElement).addEventListener("click", function () {
        followLink("LICENSE.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    (document.querySelector("#legal-self-assets-license") as HTMLElement).addEventListener("click", function () {
        followLink("LICENSE_ASSETS.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });

    (document.querySelector("#contact-imprintlink") as HTMLElement).addEventListener("click", function () {
        notify("#help-notifier", getString("helpScreenContactBackupLinkNotification", "."), NOTIFICATION_PRIO_DEFAULT, 900, null, null, window.innerHeight);
        followLink(getServerHTMLLink("imprint"), "_blank", LINK_STATE_NORMAL);
    });
    handleServerJSONValues("imprint", function (res) {
        const imprint = document.querySelector("#contact-imprint") as HTMLElement;
        imprint.innerHTML = "<b>" + getString("helpScreenContactImprintTitle") + "</b>";
        Object.keys(res).forEach(function (key) {
            var span = document.createElement("span");
            span.textContent = res[key];
            imprint.innerHTML += "<br>";
            imprint.appendChild(span);
        });
    });
    (document.querySelector("#contact-feedbacklink") as HTMLElement).addEventListener("click", function () {
        notify("#help-notifier", getString("helpScreenContactFeedbackSendNotification", "."), NOTIFICATION_PRIO_DEFAULT, 900, null, null, window.innerHeight);
        followLink(getServerHTMLLink("feedback"), "_blank", LINK_STATE_NORMAL);
    });

    (document.querySelector("#download-androidlink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_android"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-fdroidlink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_fdroid"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-windowslink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_windows"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-snaplink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("download_snap"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-sourcelink") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("source_code"), "_blank", LINK_STATE_NORMAL);
    });
    (document.querySelector("#download-translations") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("translations"), "_blank", LINK_STATE_NORMAL);
    });

    (document.querySelector("#website-link") as HTMLElement).addEventListener("click", function () {
        followLink(getServerRedirectLink("moroweb"), "_blank", LINK_STATE_NORMAL);
    });

    const elements = document.querySelectorAll(".content") as NodeListOf<HTMLElement>;
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

    var elem = document.createElement("p");
    elem.textContent = formatJSString(getString("helpScreenGeneralWelcomeSystem", "."), getUserSystem());
    (document.querySelector("#general-version") as HTMLElement).appendChild(elem);

    elem = document.createElement("p");
    elem.textContent = formatJSString(getString("helpScreenGeneralWelcomeVersion", "."), APP_DATA.version.major, APP_DATA.version.minor, APP_DATA.version.patch, APP_DATA.version.date.year, APP_DATA.version.date.month < 10 ? "0" + APP_DATA.version.date.month : APP_DATA.version.date.month, APP_DATA.version.date.day < 10 ? "0" + APP_DATA.version.date.day : APP_DATA.version.date.day, APP_DATA.version.beta > 0 ? "-beta" + APP_DATA.version.beta : "");
    (document.querySelector("#general-version") as HTMLElement).appendChild(elem);
    (document.querySelector("#general-whatsnew") as HTMLElement).addEventListener("click", function () {
        followLink("whatsnew/#newest", "_self", LINK_STATE_INTERNAL_HTML);
    });

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
