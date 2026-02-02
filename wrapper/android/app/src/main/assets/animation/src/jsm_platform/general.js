/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { getSetting, getSettings, setSetting } from "../jsm/common/settings.js";
import { getServerNote, getServerRedirectLink } from "../jsm/common/web_tools.js";
window.addEventListener("load", function () {
    getServerNote(function (serverMsg) {
        var link = null;
        if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
            link = getServerRedirectLink(serverMsg.link);
        }
        var image = null;
        var imageLink = null;
        if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
            image = serverMsg.imageSrc;
            if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                imageLink = getServerRedirectLink(serverMsg.imageLink);
            }
        }
        var backgroundImage = null;
        if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
            backgroundImage = serverMsg.backgroundImageSrc;
        }
        // Android wrapper contains WebJSInterface
        // @ts-ignore
        WebJSInterface.saveServerNote(serverMsg.id, serverMsg.title, serverMsg.text, serverMsg.validUntil, link, image, imageLink, backgroundImage);
    });
});
document.addEventListener("moroway-app-after-set-settings-html", function (event) {
    var eventCustom = event;
    if (eventCustom.detail && eventCustom.detail.elem) {
        var elems = eventCustom.detail.elem.querySelectorAll("#langoption .langvalue");
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].id != "clang") {
                elems[i].addEventListener("click", function (src) {
                    // Android wrapper contains WebJSInterface
                    // @ts-ignore
                    WebJSInterface.setLang(src.target.dataset.langCode);
                });
            }
        }
        var settings = getSettings().values;
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var key = Object.keys(settings)[i];
            // Android wrapper contains WebJSInterface
            // @ts-ignore
            WebJSInterface.setSetting(key, getSetting(Object.keys(settings)[i]));
            var settingElem = eventCustom.detail.elem.querySelector('li[data-settings-id="' + key + '"]');
            if (settingElem !== null) {
                var leftButton = settingElem.querySelector(".settings-opts-left-button");
                var textButton = settingElem.querySelector(".settings-opts-text-button");
                leftButton.addEventListener("click", function (event) {
                    var currentKey = event.target.parentNode.parentNode.dataset.settingsId;
                    // Android wrapper contains WebJSInterface
                    // @ts-ignore
                    WebJSInterface.setSetting(currentKey, getSetting(currentKey));
                });
                textButton.addEventListener("click", function (event) {
                    var currentKey = event.target.parentNode.parentNode.dataset.settingsId;
                    // Android wrapper contains WebJSInterface
                    // @ts-ignore
                    WebJSInterface.setSetting(currentKey, getSetting(currentKey));
                });
            }
        }
    }
});
// Android wrapper contains WebJSInterface
// @ts-ignore
setSetting("showVersionNoteAgain", WebJSInterface.getSettingShowVersionNoteAgain());
