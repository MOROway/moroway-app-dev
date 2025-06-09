"use strict";
import { APP_DATA } from "{{jsm}}/common/app_data.js";
import { Protocols } from "{{jsm}}/common/web_tools.js";
//Enable offline functionality
if ("serviceWorker" in navigator && window.location.href.indexOf(Protocols.Http + "://") == 0) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register(document.baseURI + "sw.js").then(
            function (registration) {
                if (APP_DATA.debug) {
                    console.error("ServiceWorker registration successful with scope: ", registration.scope);
                }
            },
            function (error) {
                if (APP_DATA.debug) {
                    console.error("ServiceWorker registration failed: ", error);
                }
            }
        );
    });
}
