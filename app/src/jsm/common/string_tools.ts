"use strict";
import {deepFreeze} from "./js_objects.js";
//HANDLE STRINGS
export function getString(prop, punctuationMark = "", caseType = "", lang = CURRENT_LANG) {
    var str: string;
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
    str += punctuationMark;
    return caseType == "upper" ? str.toUpperCase() : caseType == "lower" ? str.toLowerCase() : str;
}

export function formatJSString(str: string, ...replaces: (string | number)[]) {
    for (var i = 0; i < replaces.length; i++) {
        if (str.indexOf("{{" + i + "}}") !== -1) {
            var toReplace = new RegExp("{{[" + i + "]}}", "g");
            str = str.replace(toReplace, replaces[i].toString());
        }
    }
    var toReplace = new RegExp("{{[0-9]+}}", "g");
    str = str.replace(toReplace, "");
    return str;
}

export function formatHTMLString(str: string) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export function setHTMLStrings() {
    const elemsContent = document.querySelectorAll("*[data-stringid-content]") as NodeListOf<HTMLElement>;
    for (let i = 0; i < elemsContent.length; i++) {
        var args: string[] = [];
        var stringIdContentArrayNo = elemsContent[i].dataset.stringidContentArrayno;
        args[0] = typeof stringIdContentArrayNo == "string" ? getString([elemsContent[i].dataset.stringidContent, parseInt(stringIdContentArrayNo, 10)], elemsContent[i].dataset.stringidContentPunctuation, elemsContent[i].dataset.stringidContentCase) : getString(elemsContent[i].dataset.stringidContent, elemsContent[i].dataset.stringidContentPunctuation, elemsContent[i].dataset.stringidContentCase);
        var argsNo = 1;
        do {
            var elCArg = elemsContent[i].dataset["stringidContentArgisstringref" + argsNo] == "1" ? getString(elemsContent[i].dataset["stringidContentArg" + argsNo]) : elemsContent[i].dataset["stringidContentArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elemsContent[i].textContent = formatJSString.apply(null, args);
    }
    const elemsTitle = document.querySelectorAll("*[data-stringid-title]") as NodeListOf<HTMLElement>;
    for (let i = 0; i < elemsTitle.length; i++) {
        var args: string[] = [];
        var stringIdTitleArrayNo = elemsTitle[i].dataset.stringidTitleArrayno;
        args[0] = typeof stringIdTitleArrayNo == "string" ? getString([elemsTitle[i].dataset.stringidTitle, parseInt(stringIdTitleArrayNo, 10)], elemsTitle[i].dataset.stringidTitlePunctuation, elemsTitle[i].dataset.stringidTitleCase) : getString(elemsTitle[i].dataset.stringidTitle, elemsTitle[i].dataset.stringidTitlePunctuation, elemsTitle[i].dataset.stringidTitleCase);
        var argsNo = 1;
        do {
            var elCArg = elemsTitle[i].dataset["stringidTitleArgisstringref" + argsNo] == "1" ? getString(elemsTitle[i].dataset["stringidTitleArg" + argsNo]) : elemsTitle[i].dataset["stringidTitleArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elemsTitle[i].title = formatJSString.apply(null, args);
    }
    const elemsTooltip = document.querySelectorAll("*[data-stringid-tooltip]") as NodeListOf<HTMLElement>;
    for (let i = 0; i < elemsTooltip.length; i++) {
        var args: string[] = [];
        var stringIdTooltipArrayNo = elemsTooltip[i].dataset.stringIdTooltipArrayNo;
        args[0] = typeof stringIdTooltipArrayNo == "string" ? getString([elemsTooltip[i].dataset.stringidTooltip, parseInt(stringIdTooltipArrayNo, 10)], elemsTooltip[i].dataset.stringidTooltipPunctuation, elemsTooltip[i].dataset.stringidTooltipCase) : getString(elemsTooltip[i].dataset.stringidTooltip, elemsTooltip[i].dataset.stringidTooltipPunctuation, elemsTooltip[i].dataset.stringidTooltipCase);
        var argsNo = 1;
        do {
            var elCArg = elemsTooltip[i].dataset["stringidTooltipArgisstringref" + argsNo] == "1" ? getString(elemsTooltip[i].dataset["stringidTooltipArg" + argsNo]) : elemsTooltip[i].dataset["stringidTooltipArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elemsTooltip[i].dataset.tooltip = formatJSString.apply(null, args);
    }
    const elemsAlt = document.querySelectorAll("img[data-stringid-alt]") as NodeListOf<HTMLImageElement>;
    for (let i = 0; i < elemsAlt.length; i++) {
        var args: string[] = [];
        var stringIdAltArrayNo = elemsAlt[i].dataset.stringidAltArrayno;
        args[0] = typeof stringIdAltArrayNo == "string" ? getString([elemsAlt[i].dataset.stringidAlt, parseInt(stringIdAltArrayNo, 10)], elemsAlt[i].dataset.stringidAltPunctuation, elemsAlt[i].dataset.stringidAltCase) : getString(elemsAlt[i].dataset.stringidAlt, elemsAlt[i].dataset.stringidAltPunctuation, elemsAlt[i].dataset.stringidAltCase);
        var argsNo = 1;
        do {
            var elCArg = elemsAlt[i].dataset["stringidAltArgisstringref" + argsNo] == "1" ? getString(elemsAlt[i].dataset["stringidAltArg" + argsNo]) : elemsAlt[i].dataset["stringidAltArg" + argsNo];
            if (typeof elCArg == "string") {
                args[argsNo] = elCArg;
                argsNo++;
            } else {
                argsNo = 1;
            }
        } while (argsNo > 1);
        elemsAlt[i].alt = formatJSString.apply(null, args);
    }
}

export function getLanguageList() {
    var langCodes = Object.keys(STRINGS);
    langCodes.sort(function (a, b) {
        if (a == CURRENT_LANG) {
            return -1;
        } else if (b == CURRENT_LANG) {
            return 1;
        } else if (a == DEFAULT_LANG) {
            return -1;
        } else if (b == DEFAULT_LANG) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    });
    return langCodes;
}

export function setCurrentLang(lang) {
    window.localStorage.setItem("morowayAppLang", lang);
}

function getCurrentLang() {
    const savedLang = window.localStorage.getItem("morowayAppLang");
    if (typeof savedLang == "string") {
        return savedLang;
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

const STRINGS = "{{strings}}";
deepFreeze(STRINGS);
const DEFAULT_LANG = "en";
export const CURRENT_LANG = getCurrentLang();
