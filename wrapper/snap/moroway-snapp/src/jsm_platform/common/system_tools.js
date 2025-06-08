/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "../../jsm/common/app_data.js";
import { getMode } from "../../jsm/scripting.js";
export var SYSTEM_TOOLS = {
    canExitApp: function () {
        return true;
    },
    exitApp: function () {
        // Electron wrapper contains this function
        // @ts-ignore
        _exitApp.exec();
    },
    keepAlive: function (acquire) {
        var mode = getMode();
        if (mode == "online" || mode == "demo") {
            try {
                // Electron wrapper contains this function
                // @ts-ignore
                _keepScreenAlive.exec(acquire);
            }
            catch (error) {
                if (APP_DATA.debug) {
                    console.log("powerSaveBlocker-Error:", error);
                }
            }
        }
    }
};
