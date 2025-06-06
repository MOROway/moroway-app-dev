"use strict";
export { SYSTEM_TOOLS } from "{{jsm_platform}}/common/system_tools.js";

//SYSTEM TOOLS
export interface SYSTEM_TOOLS_INTERFACE {
    canExitApp: () => boolean;
    exitApp?: () => void;
    keepAlive: (acquire: boolean) => void;
}
