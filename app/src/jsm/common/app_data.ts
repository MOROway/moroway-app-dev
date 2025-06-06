"use strict";
import { deepFreeze } from "./js_objects.js";

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
        // @ts-ignore
        major: "{{version_major}}",
        // @ts-ignore
        minor: "{{version_minor}}",
        // @ts-ignore
        patch: "{{version_patch}}",
        // @ts-ignore
        beta: "{{beta}}",
        date: {
            // @ts-ignore
            year: "{{date_year}}",
            // @ts-ignore
            month: "{{date_month}}",
            // @ts-ignore
            day: "{{date_day}}"
        }
    },
    platform: "{{platform}}",
    // @ts-ignore
    debug: "{{debug}}"
};
deepFreeze(APP_DATA);
export { APP_DATA };

//LOCAL APP DATA COPY
export function getLocalAppDataCopy(): APP_DATA | null {
    return JSON.parse(window.localStorage.getItem("morowayAppData") || "null");
}

export function setLocalAppDataCopy(): void {
    window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
}
