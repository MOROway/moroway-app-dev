"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canExitApp() {
        return true;
    },
    exitApp() {
        // Cordova wrapper contains this function
        // @ts-ignore
        navigator.app.exitApp();
    },
    keepAlive(acquire) {
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
};
