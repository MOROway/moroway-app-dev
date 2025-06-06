"use strict";
import { NotificationPriority, notify } from "{{jsm}}/common/notify.js";
import { setSettingsHTML } from "{{jsm}}/common/settings.js";
import { getString } from "{{jsm}}/common/string_tools.js";
import { followLink, LinkStates, showServerNote } from "{{jsm}}/common/web_tools.js";
import { getMode } from "{{jsm}}/scripting.js";

document.addEventListener("moroway-app-ready", function () {
    if (getMode() == "normal") {
        showServerNote(document.querySelector("#server-note") as HTMLElement);
    }
    setSettingsHTML(document.querySelector("#settings-inner"), false);
});

document.addEventListener("moroway-app-ready-notification", function (event) {
    const eventCustom = event as CustomEvent;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify(
        "#canvas-notifier",
        getString("appScreenHasLoaded", "."),
        NotificationPriority.Default,
        4000,
        function () {
            followLink("help", "_blank", LinkStates.InternalHtml);
        },
        getString("generalTitleHelpScreen", "", "upper"),
        minHeight
    );
});

document.addEventListener("moroway-app-update-notification", function (event) {
    const eventCustom = event as CustomEvent;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify(
        "#canvas-notifier",
        getString("generalNewVersion", "!", "upper"),
        NotificationPriority.Default,
        7000,
        function () {
            followLink("whatsnew/#newest", "_blank", LinkStates.InternalHtml);
        },
        getString("appScreenFurtherInformation", "", "upper"),
        minHeight
    );
});
