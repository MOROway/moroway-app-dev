"use strict";

import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools.js";
import { getMode } from "{{jsm}}/scripting.js";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canExitApp() {
        return true;
    },
    exitApp() {
        // Electron wrapper contains this function
        // @ts-ignore
        _exitApp.exec();
    },
    keepAlive(acquire) {
        const mode = getMode();
        if (mode == "online" || mode == "demo") {
            try {
                // Electron wrapper contains this function
                // @ts-ignore
                _keepScreenAlive.exec(acquire);
            } catch (error) {
                if (APP_DATA.debug) {
                    console.log("powerSaveBlocker-Error:", error);
                }
            }
        }
    }
};
