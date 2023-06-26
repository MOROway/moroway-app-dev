//NOTIFICATIONS
function notify(elem, message, prio, timeout, actionHandler, actionText, minHeight, channel) {
    var notificationContainer = document.querySelector(elem);
    if (notificationContainer == undefined || notificationContainer == null) {
        return false;
    }
    if (prio == undefined || prio == null) {
        prio = NOTIFICATION_PRIO_DEFAULT;
    }
    if (channel == undefined || channel == null) {
        channel = NOTIFICATION_CHANNEL_DEFAULT;
    }
    if (notificationContainer.queue == undefined) {
        notificationContainer.queue = [];
    }
    if (notificationContainer.active == undefined) {
        notificationContainer.active = false;
    }
    if (notificationContainer.show == undefined) {
        notificationContainer.show = function (elem) {
            elem.active = true;
            elem.style.visibility = "";
            elem.querySelector("button").style.display = "none";
            if (elem.queue.length > 0) {
                var obj = elem.queue[0];
                elem.querySelector("span").textContent = obj.message;
                elem.style.visibility = "visible";
                if (obj.actionHandler != null && obj.actionText != null) {
                    elem.querySelector("button").textContent = obj.actionText;
                    elem.querySelector("button").onclick = obj.actionHandler;
                    elem.querySelector("button").style.display = "";
                }
                elem.queue.shift();
                elem.showTimeoutFunction = function () {
                    elem.show(elem);
                    elem.showTimeoutFunction = null;
                };
                elem.showTimeout = window.setTimeout(elem.showTimeoutFunction, obj.timeout);
            } else {
                elem.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (elem, stopFollowing) {
            stopFollowing = stopFollowing === true;
            elem.active = false;
            elem.style.visibility = "";
            if (elem.showTimeout !== undefined && elem.showTimeout !== null) {
                window.clearTimeout(elem.showTimeout);
            }
            if (typeof elem.showTimeoutFunction == "function" && !stopFollowing) {
                elem.showTimeoutFunction();
            }
        };
    }
    if (notificationContainer.sameChannelNo == undefined) {
        notificationContainer.sameChannelNo = function (elem, ch, pr) {
            for (var i = elem.queue.length - 1; i >= 0; i--) {
                if (elem.queue[i].channel == ch && elem.queue[i].prio <= pr) {
                    return i;
                }
            }
            return false;
        };
    }
    if (prio > NOTIFICATION_PRIO_LOW || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj = {message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText};
        if (prio === NOTIFICATION_PRIO_HIGH || (minHeight >= notificationContainer.offsetHeight - 15 && getSetting("showNotifications"))) {
            var chNo = notificationContainer.sameChannelNo(notificationContainer, channel, prio);
            if (channel != NOTIFICATION_CHANNEL_DEFAULT && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            } else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show(notificationContainer);
            }
        } else if (APP_DATA.debug) {
            console.log(message);
        }
    }
}

//COPY & PASTE
function copy(selector, successFunction, failFunction) {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(document.querySelector(selector));
    selection.addRange(range);
    if (document.execCommand && document.execCommand("copy")) {
        if (typeof successFunction == "function") {
            successFunction();
        }
    } else if (typeof navigator.permissions == "object") {
        navigator.permissions
            .query({name: "clipboard-write"})
            .then(function (status) {
                if (status.state == "granted") {
                    var text = document.querySelector(selector).textContent;
                    navigator.clipboard
                        .writeText(text)
                        .then(function () {
                            if (typeof successFunction == "function") {
                                successFunction();
                            }
                        })
                        .catch(function (error) {
                            if (typeof failFunction == "function") {
                                failFunction();
                            }
                            if (APP_DATA.debug) {
                                console.log(error);
                            }
                        });
                } else {
                    if (typeof failFunction == "function") {
                        failFunction();
                    }
                }
            })
            .catch(function (error) {
                if (typeof failFunction == "function") {
                    failFunction();
                }
                if (APP_DATA.debug) {
                    console.log(error);
                }
            });
    } else if (typeof failFunction == "function") {
        failFunction();
    }
}

//HANDLE OBJECTS
function copyJSObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

//HANDLE QUERY String
function getQueryString(key) {
    var value = "";
    window.location.search
        .substring(1)
        .split("&")
        .forEach(function (part) {
            if (part.indexOf("=") > 0 && part.substring(0, part.indexOf("=")) == key) {
                value = part.substring(part.indexOf("=") + 1);
            }
        });
    return value;
}

//HANDLE LINKS
function getShareLink(id, key) {
    return formatJSString("{{sharelink}}", id, key);
}
function getShareLinkServerName() {
    return "{{shareserver}}";
}
function getServerLink(protocol) {
    return (protocol == undefined ? PROTOCOL_HTTP : protocol) + "://{{serverlink}}";
}
function getServerRedirectLink(key) {
    const SERVER_REDIRECT_LINK = getServerLink() + "/redirect_to/index.php";
    return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
function getServerHTMLLink(key, showCloseButton) {
    const SERVER_HTML_LINK = getServerLink() + "/html_content/index.php";
    if (showCloseButton === undefined) {
        showCloseButton = "";
    }
    return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
function getServerDataLink(path) {
    const SERVER_DATA_LINK = getServerLink() + "/data";
    return SERVER_DATA_LINK + path;
}
function handleServerJSONValues(key, func) {
    const SERVER_JSON_LINK = getServerLink() + "/json_content/index.php";
    if (typeof fetch == "function") {
        fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG)
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                if (APP_DATA.debug) {
                    console.log("Fetch-Error:", error);
                }
            })
            .then(function (response) {
                if (typeof response == "object" && response != null && typeof response.error == "undefined") {
                    func(response);
                } else if (APP_DATA.debug) {
                    console.log(typeof response != "undefined" && response != null && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
                }
            });
    } else if (APP_DATA.debug) {
        console.log("Fetch-Error: fetch not supported");
    }
}
function getServerNote(func) {
    function getServerNoteImage(id, background) {
        return getServerDataLink("/server-note/img/") + id + (background ? "-background-image" : "-image") + ".png";
    }
    if (window.localStorage.getItem("morowayAppLastServerNoteLastQuery") == null || Date.now() - parseInt(window.localStorage.getItem("morowayAppLastServerNoteLastQuery"), 10) >= 86400000 || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == 1) {
        window.localStorage.setItem("morowayAppLastServerNoteLastQuery", Date.now());
        handleServerJSONValues("news-msg", function (serverMsg) {
            if (typeof serverMsg == "object" && serverMsg.id != undefined && typeof serverMsg.id == "number" && serverMsg.title != undefined && typeof serverMsg.title == "string" && serverMsg.text != undefined && typeof serverMsg.text == "string" && serverMsg.validUntil != undefined && typeof serverMsg.validUntil == "number" && Date.now() / 1000 <= serverMsg.validUntil && (window.localStorage.getItem("morowayAppLastServerNoteShown") != serverMsg.id || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == 1)) {
                window.localStorage.setItem("morowayAppLastServerNoteShown", serverMsg.id);
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", 0);
                if (serverMsg.image != undefined && serverMsg.image === true) {
                    serverMsg.imageSrc = getServerNoteImage(serverMsg.id, false);
                    delete serverMsg.image;
                }
                if (serverMsg.backgroundImage != undefined && serverMsg.backgroundImage === true) {
                    serverMsg.backgroundImageSrc = getServerNoteImage(serverMsg.id, true);
                    delete serverMsg.backgroundImage;
                }
                func(serverMsg);
            }
        });
    }
}
function showServerNote() {
    if (document.querySelector("#server-note") != null) {
        getServerNote(function (serverMsg) {
            document.querySelector("#server-note").style.display = "block";
            document.querySelector("#server-note-title").textContent = serverMsg.title;
            document.querySelector("#server-note-text").textContent = serverMsg.text;
            document.querySelector("#server-note #server-note-later-box").checked = false;
            document.querySelector("#server-note #server-note-later").addEventListener("click", function () {
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", document.querySelector("#server-note #server-note-later-box").checked ? 1 : 0);
            });
            document.querySelector("#server-note #server-note-button-no").addEventListener("click", function () {
                document.querySelector("#server-note").style.display = "";
            });
            if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
                document.querySelector("#server-note #server-note-button-go").style.display = "block";
                document.querySelector("#server-note #server-note-button-go").addEventListener("click", function () {
                    followLink(getServerRedirectLink(serverMsg.link), "_blank", LINK_STATE_NORMAL);
                });
            }
            if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
                document.querySelector("#server-note #server-note-img").style.display = "flex";
                document.querySelector("#server-note #server-note-img img").src = serverMsg.imageSrc;
                if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                    document.querySelector("#server-note #server-note-img img").style.cursor = "pointer";
                    document.querySelector("#server-note #server-note-img img").addEventListener("click", function () {
                        followLink(getServerRedirectLink(serverMsg.imageLink), "_blank", LINK_STATE_NORMAL);
                    });
                }
            }
            if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
                document.querySelector("#server-note").style.backgroundImage = "url(" + serverMsg.backgroundImageSrc + ")";
            }
        });
    }
}

//HANDLE STRINGS
function getString(prop, punctuationMark, caseType, lang) {
    if (typeof lang == "undefined") {
        lang = CURRENT_LANG;
    }
    var str;
    if (Array.isArray(prop)) {
        if (prop.length == 2 && typeof prop[0] == "string" && typeof prop[1] == "number") {
            if (typeof STRINGS[lang] != "undefined" && typeof STRINGS[lang][prop[0]] != "undefined" && typeof STRINGS[lang][prop[0]][prop[1]] != "undefined" && STRINGS[lang][prop[0]][prop[1]] != null && STRINGS[lang][prop[0]][prop[1]] != "") {
                str = STRINGS[lang][prop[0]][prop[1]];
            } else if (typeof STRINGS[DEFAULT_LANG] != "undefined" && typeof STRINGS[DEFAULT_LANG][prop[0]] != "undefined" && typeof STRINGS[DEFAULT_LANG][prop[0]][prop[1]] != "undefined" && STRINGS[DEFAULT_LANG][prop[0]][prop[1]] != null) {
                str = STRINGS[DEFAULT_LANG][prop[0]][prop[1]];
            } else {
                return "undefined";
            }
        } else {
            return "undefined";
        }
    } else {
        str = typeof STRINGS[lang] == "undefined" || typeof STRINGS[lang][prop] == "undefined" || STRINGS[lang][prop] == null || STRINGS[lang][prop] == "" ? (typeof STRINGS[DEFAULT_LANG] == "undefined" || typeof STRINGS[DEFAULT_LANG][prop] == "undefined" || typeof STRINGS[DEFAULT_LANG][prop] == null ? "undefined" : STRINGS[DEFAULT_LANG][prop]) : STRINGS[lang][prop];
    }
    str += typeof punctuationMark == "string" ? punctuationMark : "";
    return typeof caseType == "string" && caseType == "upper" ? str.toUpperCase() : typeof caseType == "string" && caseType == "lower" ? str.toLowerCase() : str;
}

function formatJSString(str) {
    if (typeof str !== "string") {
        return str;
    }
    for (var i = 0; i < arguments.length - 1; i++) {
        if (str.indexOf("{{" + i + "}}") !== -1 && (typeof arguments[i + 1] == "number" || typeof arguments[i + 1] == "string")) {
            var replace = new RegExp("{{[" + i + "]}}", "g");
            str = str.replace(replace, arguments[i + 1]);
        }
    }
    var replace = new RegExp("{{[0-9]+}}", "g");
    str = str.replace(replace, "");
    return str;
}

function formatHTMLString(str) {
    if (typeof str !== "string") {
        return str;
    }
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function setHTMLStrings() {
    var elems = document.querySelectorAll("*[data-stringid-content]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidContentArrayno == "string" ? getString([elems[i].dataset.stringidContent, parseInt(elems[i].dataset.stringidContentArrayno, 10)], elems[i].dataset.stringidContentPunctuation, elems[i].dataset.stringidContentCase) : getString(elems[i].dataset.stringidContent, elems[i].dataset.stringidContentPunctuation, elems[i].dataset.stringidContentCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidContentArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["stringidContentArg" + argsNo]) : elems[i].dataset["stringidContentArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].textContent = formatJSString.apply(null, args);
    }
    elems = document.querySelectorAll("*[data-stringid-title]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidTitleArrayno == "string" ? getString([elems[i].dataset.stringidTitle, parseInt(elems[i].dataset.stringidTitleArrayno, 10)], elems[i].dataset.stringidTitlePunctuation, elems[i].dataset.stringidTitleCase) : getString(elems[i].dataset.stringidTitle, elems[i].dataset.stringidTitlePunctuation, elems[i].dataset.stringidTitleCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidTitleArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["tringidTitleArg" + argsNo]) : elems[i].dataset["tringidTitleArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].title = formatJSString.apply(null, args);
    }
    elems = document.querySelectorAll("*[data-stringid-alt]");
    for (var i = 0; i < elems.length; i++) {
        var args = [];
        args[0] = typeof elems[i].dataset.stringidAltArrayno == "string" ? getString([elems[i].dataset.stringidAlt, parseInt(elems[i].dataset.stringidAltArrayno, 10)], elems[i].dataset.stringidAltPunctuation, elems[i].dataset.stringidAltCase) : getString(elems[i].dataset.stringidAlt, elems[i].dataset.stringidAltPunctuation, elems[i].dataset.stringidAltCase);
        var argsNo = 1;
        do {
            var elCArg = elems[i].dataset["stringidAltArgisstringref" + argsNo] == "1" ? getString(elems[i].dataset["stringidAltArg" + argsNo]) : elems[i].dataset["stringidAltArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elems[i].alt = formatJSString.apply(null, args);
    }
}

function setCurrentLang(lang) {
    window.localStorage.setItem("morowayAppLang", lang);
}

function getCurrentLang() {
    if (typeof window.localStorage.getItem("morowayAppLang") == "string") {
        return window.localStorage.getItem("morowayAppLang");
    }
    if (STRINGS.hasOwnProperty(window.navigator.language)) {
        return window.navigator.language;
    }
    if (STRINGS.hasOwnProperty(window.navigator.language.replace("-", "_"))) {
        return window.navigator.language.replace("-", "_");
    }
    if (STRINGS.hasOwnProperty(window.navigator.language.replace(/-.*/, ""))) {
        return window.navigator.language.replace(/-.*/, "");
    }
    const langKeys = Object.keys(STRINGS);
    for (var i = 0; i < langKeys.length; i++) {
        if (langKeys[i].replace(/_.*/, "") == window.navigator.language) {
            return langKeys[i];
        }
    }
    return DEFAULT_LANG;
}

//LOCAL APP DATA COPY
function getLocalAppDataCopy() {
    var localAppDataCopy = {};

    try {
        localAppDataCopy = JSON.parse(window.localStorage.getItem("morowayAppData") || "{}");
    } catch (e) {
        localAppDataCopy = {};
    }

    return Object.keys(localAppDataCopy).length === 0 ? null : localAppDataCopy;
}

function setLocalAppDataCopy() {
    window.localStorage.setItem("morowayAppData", JSON.stringify(APP_DATA));
}

//SETTINGS
function getSettings() {
    var values = {};
    try {
        values = JSON.parse(window.localStorage.getItem(SETTINGS_NAME) || "{}");
    } catch (e) {}

    var defaults = {showNotifications: true, classicUI: true, alwaysShowSelectedTrain: true, cursorascircle: true, burnTheTaxOffice: true, saveGame: true, reduceOptMenu: false, reduceOptMenuHideGraphicalInfoToggle: false, reduceOptMenuHideTrainControlCenter: false, reduceOptMenuHideCarControlCenter: false, reduceOptMenuHideAudioToggle: false, reduceOptMenuHideDemoMode: false, startDemoMode: false};
    var dependencies = {alwaysShowSelectedTrain: ["classicUI"], reduceOptMenuHideGraphicalInfoToggle: ["reduceOptMenu"], reduceOptMenuHideTrainControlCenter: ["reduceOptMenu"], reduceOptMenuHideCarControlCenter: ["reduceOptMenu"], reduceOptMenuHideAudioToggle: ["reduceOptMenu"], reduceOptMenuHideDemoMode: ["reduceOptMenu"]};
    var hardware = {cursorascircle: ["mouse"]};
    var platforms = {reduceOptMenuHideDemoMode: ["snap", "web", "windows"], startDemoMode: ["snap", "windows"]};

    Object.keys(defaults).forEach(function (key) {
        if (typeof values[key] !== "boolean") {
            values[key] = defaults[key];
        }
    });
    Object.keys(values).forEach(function (key) {
        if (typeof defaults[key] !== "boolean") {
            delete values[key];
        }
    });

    return {values: values, dependencies: dependencies, hardware: hardware, platforms: platforms};
}

function isSettingActive(a) {
    var settingsComplete = getSettings();
    var isSettingActive = true;
    if (settingsComplete.dependencies[a] != null) {
        settingsComplete.dependencies[a].forEach(function (key) {
            if (!getSetting(key)) {
                isSettingActive = false;
            }
        });
    }
    return isSettingActive;
}

function isHardwareAvailable(a) {
    var settingsComplete = getSettings();
    var isHardwareAvailable = true;
    if (settingsComplete.hardware[a] != null) {
        settingsComplete.hardware[a].forEach(function (current) {
            Array(current).forEach(function (key) {
                if (AVAILABLE_HARDWARE.indexOf(key) == -1) {
                    isHardwareAvailable = false;
                }
            });
        });
    }
    return isHardwareAvailable;
}

function isInPlatformList(a) {
    var settingsComplete = getSettings();
    var isInPlatformList = true;
    if (settingsComplete.platforms[a] != null) {
        isInPlatformList = settingsComplete.platforms[a].indexOf(APP_DATA.platform) > -1;
    }
    return isInPlatformList;
}

function setSettingsHTML(elem, standalone) {
    function displaySettingsOpts() {
        var settings = getSettings().values;
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var settingId = Object.keys(settings)[i];
            var settingElem = document.querySelector("li[data-settings-id='" + settingId + "']");
            if (settingElem !== null) {
                var leftButton = settingElem.querySelector(".settings-opts-left-button");
                if (Object.values(settings)[i]) {
                    leftButton.style.backgroundColor = "black";
                    leftButton.style.transform = "rotate(360deg)";
                } else {
                    leftButton.style.backgroundColor = "";
                    leftButton.style.transform = "rotate(0deg)";
                }
                if (isSettingActive(settingId) && isHardwareAvailable(settingId) && isInPlatformList(settingId)) {
                    settingElem.style.setProperty("max-height", "");
                    settingElem.style.setProperty("margin", "");
                    settingElem.style.setProperty("border", "");
                    settingElem.style.setProperty("padding", "");
                    settingElem.style.setProperty("opacity", "");
                } else {
                    settingElem.style.setProperty("max-height", "0");
                    settingElem.style.setProperty("margin", "0");
                    settingElem.style.setProperty("border", "0");
                    settingElem.style.setProperty("padding", "0");
                    settingElem.style.setProperty("opacity", "0.5");
                }
            }
        }
    }

    function displaySettingsButtons() {
        var settings = getSettings().values;
        var btnSaveGameDeleteGame = document.querySelector("#saveGameDeleteGame");
        if (btnSaveGameDeleteGame == undefined || btnSaveGameDeleteGame == null) {
            return false;
        }
        if (settings.saveGame || !isGameSaved() || !standalone) {
            btnSaveGameDeleteGame.style.display = "";
        } else {
            btnSaveGameDeleteGame.style.display = "inline";
        }
        var reduceOptMenuHideItems = document.querySelectorAll(".reduce-opt-menu-hide-item");
        for (var i = 0; i < reduceOptMenuHideItems.length; i++) {
            if (!settings.reduceOptMenu) {
                reduceOptMenuHideItems[i].style.display = "";
            } else {
                reduceOptMenuHideItems[i].style.display = "inline";
                reduceOptMenuHideItems[i].style.textDecoration = "";
                reduceOptMenuHideItems[i].textContent = getString("optButton_morowayApp_" + reduceOptMenuHideItems[i].dataset.settingsId);
                if (settings[reduceOptMenuHideItems[i].dataset.settingsId]) {
                    reduceOptMenuHideItems[i].style.textDecoration = "line-through";
                }
            }
        }
    }

    function changeSetting(event, idOnElement) {
        var settings = getSettings().values;
        var id = idOnElement ? event.target.dataset.settingsId : event.target.parentNode.parentNode.dataset.settingsId;
        if (isSettingActive(id) && isHardwareAvailable(id) && isInPlatformList(id)) {
            settings[id] = !settings[id];
            window.localStorage.setItem(SETTINGS_NAME, JSON.stringify(settings));
            displaySettingsOpts();
            displaySettingsButtons();
            notify(".notify", getString("optApply", "."), NOTIFICATION_PRIO_LOW, 900, null, null, window.innerHeight);
        }
    }

    if (elem == undefined || elem == null) {
        return false;
    }
    if (standalone == undefined || standalone == null) {
        standalone = true;
    }
    elem.classList.add("settings");
    var rootId = "settings-list-" + SETTINGS_NAME;
    var existingRoot = elem.querySelector("#" + rootId);
    if (existingRoot != undefined) {
        elem.removeChild(existingRoot);
    }
    var root = document.createElement("ul");
    root.className = "settings-list";
    root.id = rootId;
    var settings = getSettings().values;
    for (var i = 0; i < Object.keys(settings).length; i++) {
        var opt = Object.keys(settings)[i];
        if (getString("optTitle_" + SETTINGS_NAME + "_" + opt) != "undefined") {
            var optElem = document.createElement("li");
            optElem.dataset.settingsId = opt;
            var child = document.createElement("div");
            child.className = "settings-opts-wrapper";
            var kid = document.createElement("i");
            kid.textContent = "settings";
            kid.className = "settings-opts-left-button material-icons";
            kid.addEventListener("click", function (event) {
                changeSetting(event);
            });
            child.appendChild(kid);
            kid = document.createElement("span");
            kid.textContent = getString("optTitle_" + SETTINGS_NAME + "_" + opt);
            kid.className = "settings-opts-text-button";
            kid.addEventListener("click", function (event) {
                changeSetting(event);
            });
            child.appendChild(kid);
            optElem.appendChild(child);
            child = document.createElement("div");
            child.className = "settings-hints-wrapper";
            if (getString("optDesc_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("span");
                kid.textContent = getString("optDesc_" + SETTINGS_NAME + "_" + opt);
                child.appendChild(kid);
            }
            if (getString("optDesc_" + SETTINGS_NAME + "_" + opt) != "undefined" && getString("optInfo_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("br");
                child.appendChild(kid);
            }
            if (getString("optInfo_" + SETTINGS_NAME + "_" + opt) != "undefined") {
                kid = document.createElement("i");
                kid.textContent = getString("optInfo_" + SETTINGS_NAME + "_" + opt);
                child.appendChild(kid);
            }
            optElem.appendChild(child);
            if (opt == "saveGame") {
                child = document.createElement("div");
                child.className = "settings-buttons-wrapper";
                kid = document.createElement("button");
                kid.className = "settings-button";
                kid.id = "saveGameDeleteGame";
                kid.textContent = getString("optButton_morowayApp_saveGame_delete");
                kid.addEventListener("click", function () {
                    removeSavedGame();
                    displaySettingsButtons();
                });
                child.appendChild(kid);
                optElem.appendChild(child);
            } else if (opt == "reduceOptMenu") {
                child = document.createElement("div");
                child.className = "settings-buttons-wrapper";
                var kidNames = ["reduceOptMenuHideGraphicalInfoToggle", "reduceOptMenuHideTrainControlCenter", "reduceOptMenuHideCarControlCenter", "reduceOptMenuHideAudioToggle", "reduceOptMenuHideDemoMode"];
                kidNames.forEach(function (kidName) {
                    if (isHardwareAvailable(kidName) && isInPlatformList(kidName)) {
                        kid = document.createElement("button");
                        kid.className = "settings-button reduce-opt-menu-hide-item";
                        kid.dataset.settingsId = kidName;
                        kid.addEventListener("click", function (event) {
                            changeSetting(event, true);
                        });
                        child.appendChild(kid);
                    }
                });
                optElem.appendChild(child);
            }
            root.appendChild(optElem);
        }
    }
    elem.appendChild(root);
    rootId = "langoption";
    root = document.createElement("div");
    existingRoot = elem.querySelector("#" + rootId);
    if (existingRoot != undefined) {
        elem.removeChild(existingRoot);
    }
    root.id = rootId;
    child = document.createElement("div");
    child.id = "langoptioninfo";
    child.textContent = getString("optLangSelectInfo", ":");
    root.appendChild(child);
    Object.keys(STRINGS).forEach(function (val) {
        child = document.createElement("button");
        child.className = "langvalue";
        child.textContent = getString("langName", "", "", val);
        child.dataset.langCode = val;
        if (val == CURRENT_LANG) {
            child.id = "clang";
        } else {
            child.addEventListener("click", function () {
                setCurrentLang(val);
                notify(
                    ".notify",
                    getString("optLangSelectChange", "!", "upper", val),
                    NOTIFICATION_PRIO_HIGH,
                    10000,
                    function () {
                        followLink(window.location.href, "_self", LINK_STATE_INTERNAL_HTML);
                    },
                    getString("optLangSelectChangeButton", "", "upper", val)
                );
            });
        }
        root.appendChild(child);
    });
    elem.appendChild(root);
    displaySettingsOpts();
    displaySettingsButtons();
    if (typeof setSettingsHTMLLocal == "function") {
        setSettingsHTMLLocal(elem, standalone);
    }
}
function getSetting(key) {
    if (!key) {
        return false;
    }
    return getSettings().values[key] && isSettingActive(key) && isHardwareAvailable(key) && isInPlatformList(key);
}

//SAVED GAME
function getVersionCode() {
    return APP_DATA.version.major * 10000 + APP_DATA.version.minor * 100 + APP_DATA.version.patch;
}

function isGameSaved() {
    var keys = Object.keys(window.localStorage);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("morowayAppSaved") === 0) {
            return true;
        }
    }
    return false;
}
function updateSavedGame() {
    function updateSavedGameElem(regexOld, old, newItem) {
        var elemKeys = savedGameKeys.filter(function (elem) {
            return elem.search(regexOld) === 0 || elem == old;
        });
        elemKeys.sort(function (elem1, elem2) {
            if (elem1 == old) {
                return 1;
            } else if (elem2 == old) {
                return -1;
            } else {
                return parseInt(elem2.replace(regexOld, "$1"), 10) - parseInt(elem1.replace(regexOld, "$1"), 10);
            }
        });
        if (elemKeys.length > 0 && (elemKeys[0] == old || getVersionCode() >= parseInt(elemKeys[0].replace(regexOld, "$1"), 10))) {
            var newVal = window.localStorage.getItem(elemKeys[0]);
            if (APP_DATA.version.beta == 0) {
                elemKeys.forEach(function (key) {
                    window.localStorage.removeItem(key);
                });
            }
            window.localStorage.setItem(newItem, newVal);
        }
    }
    var localStorageKeys = Object.keys(window.localStorage);
    var savedGameKeys = localStorageKeys.filter(function (elem) {
        return elem.indexOf("morowayAppSaved") === 0;
    });
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Bg$/, "morowayAppSavedBg", "morowayAppSavedGame_v-" + getVersionCode() + "_Bg");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Trains$/, "morowayAppSavedGameTrains", "morowayAppSavedGame_v-" + getVersionCode() + "_Trains");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Switches$/, "morowayAppSavedGameSwitches", "morowayAppSavedGame_v-" + getVersionCode() + "_Switches");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_Cars$/, "morowayAppSavedCars", "morowayAppSavedGame_v-" + getVersionCode() + "_Cars");
    updateSavedGameElem(/^morowayAppSavedGame_v-([0-9]+)_CarParams$/, "morowayAppSavedCarParams", "morowayAppSavedGame_v-" + getVersionCode() + "_CarParams");
    if (APP_DATA.version.beta == 0) {
        savedGameKeys.forEach(function (key) {
            if (key == "morowayAppSavedWithVersion") {
                window.localStorage.removeItem(key);
            }
        });
    }
}
function removeSavedGame() {
    Object.keys(window.localStorage).forEach(function (key) {
        if (key.indexOf("morowayAppSaved") === 0) {
            window.localStorage.removeItem(key);
        }
    });
}

//GUI STATE
function getGuiState(item) {
    var guiState = {};
    try {
        guiState = JSON.parse(window.localStorage.getItem("morowayAppGuiState") || "{}");
    } catch (e) {
        guiState = {};
    }
    if (item) {
        return guiState[item];
    }
    return guiState;
}

function setGuiState(item, value) {
    var guiState = getGuiState();
    guiState[item] = value;
    window.localStorage.setItem("morowayAppGuiState", JSON.stringify(guiState));
}

//WINDOW
function measureViewspace(a) {
    var b = [{hasTouch: "ontouchstart" in document.documentElement}, {isSmallDevice: window.innerHeight < 290 || window.innerWidth < 750}, {isTinyDevice: window.innerHeight < 250 || window.innerWidth < 600}];
    return a == -1 ? b : a < b.length && a >= 0 ? b[a] : false;
}

//GLOBAL CONSTANTS
const LINK_STATE_NORMAL = 0;
const LINK_STATE_INTERNAL_HTML = 1;
const LINK_STATE_INTERNAL_LICENSE_FILE = 2;

const PROTOCOL_HTTP = "{{hypertextprotocol}}";
const PROTOCOL_WS = "{{websocketprotocol}}";

const NOTIFICATION_PRIO_LOW = 0;
const NOTIFICATION_PRIO_DEFAULT = 1;
const NOTIFICATION_PRIO_HIGH = 2;

const NOTIFICATION_CHANNEL_DEFAULT = 0;
const NOTIFICATION_CHANNEL_TRAIN_SWITCHES = 1;
const NOTIFICATION_CHANNEL_CLASSIC_UI_TRAIN_SWITCH = 2;
const NOTIFICATION_CHANNEL_TEAMPLAY_CHAT = 3;

const STRINGS = "{{strings}}";
Object.freeze(STRINGS);
const DEFAULT_LANG = "en";
const CURRENT_LANG = getCurrentLang();

var SETTINGS_NAME = "morowayApp";
var AVAILABLE_HARDWARE = [];
if (window.matchMedia("(pointer: fine)").matches) {
    AVAILABLE_HARDWARE[AVAILABLE_HARDWARE.length] = "mouse";
}

//Browser Compatibility
if (typeof Object.values == "undefined") {
    Object.values = function (obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    };
}
