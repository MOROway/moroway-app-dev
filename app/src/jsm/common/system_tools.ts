"use strict";
export { SYSTEM_TOOLS } from "{{jsm_platform}}/common/system_tools.js";

//SYSTEM TOOLS
export interface SYSTEM_TOOLS_INTERFACE {
    canAutoplayMedia: () => boolean;
    canExitApp: () => boolean;
    exitApp: () => void;
    forceModeSwitchHandling: (newMode: boolean) => "navigate" | "historyReplace" | false;
    keepAlive: (acquire: boolean) => void;
    navigateBack: () => void;
}
