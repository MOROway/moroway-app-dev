"use strict";
import {optionsMenuEditorAdd, optionsMenuEditorHide} from "../jsm/scripting.js";
import {getSetting} from "../jsm/common/settings.js";
import {getString} from "../jsm/common/string_tools.js";

document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    optionsMenuEditorHide("canvas-team");
    optionsMenuEditorHide("canvas-single");
    optionsMenuEditorHide("canvas-settings");
    optionsMenuEditorHide("canvas-help");
    optionsMenuEditorHide("canvas-demo-mode");
    if (!getSetting("reduceOptMenuHideExit")) {
        optionsMenuEditorAdd("canvas-platform-back", getString("generalBack"), "close", function () {
            WebJSInterface.goBack();
        });
    }
});
