function followLink(input1, input2, input3) {
    if (input3 == LINK_STATE_INTERNAL_HTML) {
        var hash, queryString;
        if (input1.indexOf("#") != -1) {
            hash = input1.substr(input1.indexOf("#"));
            input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
        }
        if (input1.indexOf("?") != -1) {
            queryString = input1.substr(input1.indexOf("?"));
            input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("?")));
        }
        if (!input1.endsWith("/") && !input1.endsWith(".html")) {
            input1 += input1.length == 0 ? "./" : "/";
        }
        if (queryString !== undefined) {
            input1 += queryString;
        }
        if (hash !== undefined) {
            input1 += hash;
        }
    }
    if (input3 == LINK_STATE_NORMAL && typeof Windows != "undefined") {
        Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(input1)).then(function (success) {
            if (!success && document.querySelector(".notify") != null) {
                notify(".notify", getString("platformWindowsLinkError"), NOTIFICATION_PRIO_HIGH, 1000, null, null, window.innerHeight);
            }
        });
    } else {
        window.open(input1, input2);
    }
}

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
