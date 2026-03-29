/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { APP_DATA } from "../../jsm/common/app_data.js";
export const SYSTEM_TOOLS = {
    canAutoplayMedia: () => true,
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
            }
            catch (error) {
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
