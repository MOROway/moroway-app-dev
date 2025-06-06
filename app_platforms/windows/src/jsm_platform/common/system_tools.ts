"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools.js";
import { getMode } from "{{jsm}}/scripting";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canExitApp() {
        return !window.matchMedia("(display-mode: browser)").matches;
    },
    exitApp() {
        try {
            window.close();
        } catch (error) {
            if (APP_DATA.debug) {
                console.log("Window-Close-Error:", error);
            }
        }
    },
    keepAlive(acquire) {
        const mode = getMode();
        if (mode == "online" || mode == "demo") {
            if (acquire) {
                try {
                    navigator.wakeLock.request("screen");
                } catch (error) {
                    if (APP_DATA.debug) {
                        console.log("Wake-Lock-Error:", error);
                    }
                }
            }
        }
    }
};
