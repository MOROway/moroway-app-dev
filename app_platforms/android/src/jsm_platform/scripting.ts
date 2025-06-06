"use strict";
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
            // Android wrapper contains WebJSInterface
            // @ts-ignore
            WebJSInterface.goBack();
        });
    }
});
