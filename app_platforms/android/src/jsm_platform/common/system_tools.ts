"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools.js";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canExitApp: () => true,
    exitApp() {
        // Android wrapper contains WebJSInterface
        // @ts-ignore
        WebJSInterface.exitApp();
    },
    forceModeSwitchHandling(newMode) {
        return newMode ? "navigate" : false;
    },
    keepAlive(acquire) {
        if (acquire) {
            try {
                navigator.wakeLock.request("screen");
            } catch (error) {
                if (APP_DATA.debug) {
                    console.error("Wake-Lock-Error:", error);
                }
            }
        }
    },
    navigateBack() {
        // Android wrapper contains WebJSInterface
        // @ts-ignore
        WebJSInterface.goBack();
    }
};
