"use strict";
import {APP_DATA} from "{{jsm}}/common/app_data.js";
import {PROTOCOL_HTTP} from "{{jsm}}/common/web_tools.js";
//Enable offline functionality
if ("serviceWorker" in navigator && window.location.href.indexOf(PROTOCOL_HTTP + "://") == 0) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register(document.baseURI + "sw.js").then(
            function (registration) {
                if (APP_DATA.debug) {
                    console.log("ServiceWorker registration successful with scope: ", registration.scope);
                }
            },
            function (err) {
                if (APP_DATA.debug) {
                    console.log("ServiceWorker registration failed: ", err);
                }
            }
        );
    });
}
