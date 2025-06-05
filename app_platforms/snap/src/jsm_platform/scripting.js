"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { NotificationPriority, notify } from "{{jsm}}/common/notify.js";
import { setSettingsHTML } from "{{jsm}}/common/settings.js";
import { getString } from "{{jsm}}/common/string_tools.js";
import { followLink, LinkStates, showServerNote } from "{{jsm}}/common/web_tools.js";
import { getMode, optionsMenuEditorAdd } from "{{jsm}}/scripting.js";

document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    optionsMenuEditorAdd("canvas-platform-exit", getString("platformSnapAppExit"), "close", _exitApp.exec);
});

document.addEventListener("moroway-app-ready", function () {
    if (getMode() == "normal") {
        showServerNote(document.querySelector("#server-note"));
    }
    setSettingsHTML(document.querySelector("#settings-inner"), false);
});

document.addEventListener("moroway-app-ready-notification", function (event) {
    var minHeight = 0;
    if (event.detail && event.detail.notifyMinHeight) {
        minHeight = event.detail.notifyMinHeight;
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
    var minHeight = 0;
    if (event.detail && event.detail.notifyMinHeight) {
        minHeight = event.detail.notifyMinHeight;
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
document.addEventListener("moroway-app-keep-screen-alive", function (event) {
    const mode = getMode();
    if (mode == "online" || mode == "demo") {
        if (event.detail) {
            try {
                _keepScreenAlive.exec(event.detail.acquire);
            } catch (error) {
                if (APP_DATA.debug) {
                    console.log("powerSaveBlocker-Error:", error);
                }
            }
        }
    }
});

document.addEventListener("moroway-app-exit", function () {
    _exitApp.exec();
});
