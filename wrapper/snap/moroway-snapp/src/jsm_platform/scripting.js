/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { NotificationPriority, notify } from "../jsm/common/notify.js";
import { setSettingsHTML } from "../jsm/common/settings.js";
import { getString } from "../jsm/common/string_tools.js";
import { followLink, LinkStates, showServerNote } from "../jsm/common/web_tools.js";
import { getMode, optionsMenuEditorAdd } from "../jsm/scripting.js";
document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    // Electron wrapper contains this function
    // @ts-ignore
    optionsMenuEditorAdd("canvas-platform-exit", getString("platformSnapAppExit"), "close", _exitApp.exec);
});
document.addEventListener("moroway-app-ready", function () {
    if (getMode() == "normal") {
        showServerNote(document.querySelector("#server-note"));
    }
    setSettingsHTML(document.querySelector("#settings-inner"), false);
});
document.addEventListener("moroway-app-ready-notification", function (event) {
    var eventCustom = event;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify("#canvas-notifier", getString("appScreenHasLoaded", "."), NotificationPriority.Default, 4000, function () {
        followLink("help", "_blank", LinkStates.InternalHtml);
    }, getString("generalTitleHelpScreen", "", "upper"), minHeight);
});
document.addEventListener("moroway-app-update-notification", function (event) {
    var eventCustom = event;
    var minHeight = 0;
    if (eventCustom.detail && eventCustom.detail.notifyMinHeight) {
        minHeight = eventCustom.detail.notifyMinHeight;
    }
    notify("#canvas-notifier", getString("generalNewVersion", "!", "upper"), NotificationPriority.Default, 7000, function () {
        followLink("whatsnew/#newest", "_blank", LinkStates.InternalHtml);
    }, getString("appScreenFurtherInformation", "", "upper"), minHeight);
});
