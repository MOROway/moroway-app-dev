"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { SYSTEM_TOOLS_INTERFACE } from "{{jsm}}/common/system_tools.js";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";

export const SYSTEM_TOOLS: SYSTEM_TOOLS_INTERFACE = {
    canExitApp() {
        return !window.matchMedia("(display-mode: browser)").matches && window.history.length === 1;
    },
    exitApp() {
        try {
            window.close();
        } catch (error) {
            if (APP_DATA.debug) {
                console.error("Window-Close-Error:", error);
            }
        }
    },
    forceModeSwitchHandling() {
        if (window.matchMedia("(display-mode: browser)").matches) {
            return false;
        }
        return "historyReplace";
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
        if (document.referrer.startsWith(document.baseURI) && document.referrer !== document.baseURI && window.history.length > 1) {
            window.history.back();
        } else {
            try {
                window.close();
            } catch (error) {
                if (APP_DATA.debug) {
                    console.error("Window-Close-Error:", error);
                }
            }
            followLink("./", "_self", LinkStates.InternalHtml);
        }
    }
};
