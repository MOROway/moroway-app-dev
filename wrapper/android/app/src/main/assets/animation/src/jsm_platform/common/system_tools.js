/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "../../jsm/common/app_data.js";
export var SYSTEM_TOOLS = {
    canExitApp: function () { return true; },
    exitApp: function () {
        // Android wrapper contains WebJSInterface
        // @ts-ignore
        WebJSInterface.exitApp();
    },
    forceModeSwitchHandling: function (newMode) {
        return newMode ? "navigate" : false;
    },
    keepAlive: function (acquire) {
        if (acquire) {
            try {
                navigator.wakeLock.request("screen");
            }
            catch (error) {
                if (APP_DATA.debug) {
                    console.error("Wake-Lock-Error:", error);
                }
            }
        }
    },
    navigateBack: function () {
        // Android wrapper contains WebJSInterface
        // @ts-ignore
        WebJSInterface.goBack();
    }
};
