function followLink(input1, input2, input3) {
    var followLink = true;
    switch (input3) {
        case LINK_STATE_NORMAL:
            break;
        case LINK_STATE_INTERNAL_HTML:
            var hash, queryString;
            if (input1.indexOf("#") != -1) {
                hash = input1.substr(input1.indexOf("#"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
            }
            if (input1.indexOf("?") != -1) {
                queryString = input1.substr(input1.indexOf("?"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("?")));
            }
            input1 = input1.length == 0 ? "./index.html" : input1.substr(input1.length - 1, 1) == "/" ? input1 + "index.html" : input1.substr(input1.length - 5, 5) == ".html" ? input1 : input1 + "/index.html";
            if (queryString !== undefined) {
                followLink = false;
                WebJSInterface.handleQueryString(queryString.substr(1));
            }
            if (hash !== undefined) {
                input1 += hash;
            }
            break;
        case LINK_STATE_INTERNAL_LICENSE_FILE:
            break;
    }
    if (followLink) {
        window.open(input1, input2);
    }
}

function setSettingsHTMLLocal(elem, standalone, storageArea, showLang) {
    if (typeof window.localStorage != "undefined") {
        if (showLang) {
            var elems = elem.querySelectorAll("#langoption .langvalue");
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].id != "clang") {
                    elems[i].addEventListener("click", function (src) {
                        WebJSInterface.setLang(src.target.dataset.langCode);
                    });
                }
            }
        }
        var settings = getSettings(false, storageArea);
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var a = Object.values(settings)[i];
            var b = Object.keys(settings)[i];
            WebJSInterface.setSetting(storageArea, b, a);
            if (elem.querySelector('[data-settings-id="' + b + '"][data-settings-storage-area="' + storageArea + '"]') !== null) {
                var leftButton = elem.querySelector('[data-settings-id="' + b + '"][data-settings-storage-area="' + storageArea + '"]').querySelector(".settings-opts-left-button");
                var textButton = elem.querySelector('[data-settings-id="' + b + '"][data-settings-storage-area="' + storageArea + '"]').querySelector(".settings-opts-text-button");
                leftButton.addEventListener("click", function (event) {
                    var b = event.target.parentNode.parentNode.dataset.settingsId;
                    WebJSInterface.setSetting(storageArea, b);
                });
                textButton.addEventListener("click", function (event) {
                    var b = event.target.parentNode.parentNode.dataset.settingsId;
                    WebJSInterface.setSetting(storageArea, b);
                });
            }
        }
    }
}
window.addEventListener("load", function () {
    var elems = document.querySelectorAll(".internal-link");
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
    getServerNote(function (serverMsg) {
        if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
            WebJSInterface.saveServerNote(serverMsg.id, serverMsg.title, serverMsg.text, serverMsg.validUntil, getServerRedirectLink(serverMsg.link));
        } else {
            WebJSInterface.saveServerNote(serverMsg.id, serverMsg.title, serverMsg.text, serverMsg.validUntil);
        }
    });
});
