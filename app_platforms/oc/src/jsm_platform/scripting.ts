"use strict";
import { getSetting } from "{{jsm}}/common/settings.js";
import { getString } from "{{jsm}}/common/string_tools.js";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";
import { getMode, optionsMenuEditorHide } from "{{jsm}}/scripting.js";

document.addEventListener("moroway-app-after-calc-options-menu-load", function () {
    optionsMenuEditorHide("canvas-team");
    optionsMenuEditorHide("canvas-single");
    optionsMenuEditorHide("canvas-settings");
    optionsMenuEditorHide("canvas-help");
    optionsMenuEditorHide("canvas-demo-mode");
});

document.addEventListener("deviceready", function () {
    document.addEventListener(
        "backbutton",
        function (e) {
            e.preventDefault();
            if (getMode() != "demo" && (!getSetting("saveGame") || getMode() == "online")) {
                // Cordova wrapper contains this function
                // @ts-ignore
                navigator.notification.confirm(
                    getString("generalLeaveAndDestroyGame"),
                    function (button) {
                        if (button == 1) {
                            followLink("html_platform/start.html", "_self", LinkStates.InternalHtml);
                        }
                    },
                    getString("generalLeaveAndDestroyGameTitle"),
                    [getString("generalLeaveAndDestroyGameYes"), getString("generalLeaveAndDestroyGameNo")]
                );
            } else {
                followLink("html_platform/start.html", "_self", LinkStates.InternalHtml);
            }
        },
        false
    );
});
