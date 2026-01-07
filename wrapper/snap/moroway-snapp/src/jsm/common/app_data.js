/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { deepFreeze } from "./js_objects.js";
//Placeholders are set by build-script, type error is therefore intentional
var APP_DATA = {
    version: {
        // @ts-ignore
        major: 10,
        // @ts-ignore
        minor: 3,
        // @ts-ignore
        patch: 11,
        // @ts-ignore
        beta: 1,
        date: {
            // @ts-ignore
            year: 2026,
            // @ts-ignore
            month: 1,
            // @ts-ignore
            day: 7
        }
    },
    platform: "snap",
    // @ts-ignore
    debug: false
};
deepFreeze(APP_DATA);
export { APP_DATA };
//LOCAL APP DATA COPY
export function getLocalAppDataCopy() {
    return JSON.parse(window.localStorage.getItem("morowayAppData") || "null");
}
export function setLocalAppDataCopy() {
    window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
}
