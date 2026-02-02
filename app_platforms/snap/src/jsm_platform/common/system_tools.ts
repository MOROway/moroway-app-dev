"use strict";

import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools.js";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canAutoplayMedia: () => true,
    canExitApp: () => true,
    exitApp() {
        // Electron wrapper contains this function
        // @ts-ignore
        _exitApp.exec();
    },
    forceModeSwitchHandling: () => false,
    keepAlive(acquire) {
        try {
            // Electron wrapper contains this function
            // @ts-ignore
            _keepScreenAlive.exec(acquire);
        } catch (error) {
            if (APP_DATA.debug) {
                console.error("powerSaveBlocker-Error:", error);
            }
        }
    },
    navigateBack() {
        (async () => {
            // Electron wrapper contains this function
            // @ts-ignore
            if (await _canGoBack.exec()) {
                // Electron wrapper contains this function
                // @ts-ignore
                _goBack.exec();
            } else {
                window.close();
            }
        })();
    }
};
