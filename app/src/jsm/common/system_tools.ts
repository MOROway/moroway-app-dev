"use strict";
export { SYSTEM_TOOLS } from "{{jsm_platform}}/common/system_tools.js";

//SYSTEM TOOLS
export interface SYSTEM_TOOLS_INTERFACE {
    canExitApp: () => boolean;
    exitApp: () => void;
    getAppMode: () => "app" | "webapp" | "website";
    keepAlive: (acquire: boolean) => void;
    navigateBack: () => void;
}
