////Required code (needs to be set on each platform)
function followLink(input1,input2, input3){
    if(input3 == LINK_STATE_INTERNAL_HTML && !(input1.endsWith("/")) && input1.indexOf("#") == -1 && input1.indexOf("?") == -1) {
        input1 = input1 + "/";
    } else if (input1.indexOf("/#") == -1 && input1.indexOf("#") > -1) {
        input1 = input1.replace(/#/, "/#");
    }
    window.open(input1, input2);
}

////Optional code (app works without it)
//Enable offline functionality
if ("serviceWorker" in navigator && window.location.href.indexOf(PROTOCOL_HTTP + "://") == 0) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register(document.baseURI + "sw.js").then(function(registration) {
            if(APP_DATA.debug) {
                console.log("ServiceWorker registration successful with scope: ", registration.scope);
            }
        }, function(err) {
            if(APP_DATA.debug) {
                console.log("ServiceWorker registration failed: ", err);
            }
        });
    });
}
