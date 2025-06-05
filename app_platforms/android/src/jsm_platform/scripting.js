"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { getSetting } from "{{jsm}}/common/settings.js";
import { getString } from "{{jsm}}/common/string_tools.js";
import { optionsMenuEditorAdd, optionsMenuEditorHide } from "{{jsm}}/scripting.js";

document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    optionsMenuEditorHide("canvas-team");
    optionsMenuEditorHide("canvas-single");
    optionsMenuEditorHide("canvas-settings");
    optionsMenuEditorHide("canvas-help");
    optionsMenuEditorHide("canvas-demo-mode");
    if (!getSetting("reduceOptMenuHideExit")) {
        optionsMenuEditorAdd("canvas-platform-back", getString("generalBack"), "cancel", function () {
            WebJSInterface.goBack();
        });
    }
});

document.addEventListener("moroway-app-keep-screen-alive", function (event) {
    if (event.detail) {
        if (event.detail.acquire) {
            try {
                navigator.wakeLock.request("screen");
            } catch (error) {
                if (APP_DATA.debug) {
                    console.log("Wake-Lock-Error:", error);
                }
            }
        }
    }
});
