"use strict";
import {deepFreeze} from "./js_objects.js";
interface APP_DATA {
    version: {
        major: number;
        minor: number;
        patch: number;
        beta: number;
        date: {
            year: number;
            month: number;
            day: number;
        };
    };
    platform: string;
    debug: boolean;
}
//Placeholders are set by build-script, type error is therefore intentional
const APP_DATA: APP_DATA = {
    version: {
        major: "{{version_major}}",
        minor: "{{version_minor}}",
        patch: "{{version_patch}}",
        beta: "{{beta}}",
        date: {
            year: "{{date_year}}",
            month: "{{date_month}}",
            day: "{{date_day}}"
        }
    },
    platform: "{{platform}}",
    debug: "{{debug}}"
};
deepFreeze(APP_DATA);
export {APP_DATA};

//LOCAL APP DATA COPY
export function getLocalAppDataCopy(): APP_DATA | null {
    return JSON.parse(window.localStorage.getItem("morowayAppData") || "null");
}

export function setLocalAppDataCopy() {
    window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
}
