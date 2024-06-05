/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import {getSetting, getSettings, setSetting} from "../jsm/common/settings.js";
import {getServerNote, getServerRedirectLink} from "../jsm/common/web_tools.js";

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
        WebJSInterface.saveServerNote(serverMsg.id, serverMsg.title, serverMsg.text, serverMsg.validUntil, link, image, imageLink, backgroundImage);
    });
});

document.addEventListener("moroway-app-after-set-settings-html", function (event) {
    if (event.detail && event.detail.elem) {
        var elems = event.detail.elem.querySelectorAll("#langoption .langvalue");
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].id != "clang") {
                elems[i].addEventListener("click", function (src) {
                    WebJSInterface.setLang(src.target.dataset.langCode);
                });
            }
        }
        var settings = getSettings().values;
        for (var i = 0; i < Object.keys(settings).length; i++) {
            var key = Object.keys(settings)[i];
            WebJSInterface.setSetting(key, getSetting(Object.keys(settings)[i]));
            var settingElem = event.detail.elem.querySelector('li[data-settings-id="' + key + '"]');
            if (settingElem !== null) {
                var leftButton = settingElem.querySelector(".settings-opts-left-button");
                var textButton = settingElem.querySelector(".settings-opts-text-button");
                leftButton.addEventListener("click", function (event) {
                    var currentKey = event.target.parentNode.parentNode.dataset.settingsId;
                    WebJSInterface.setSetting(currentKey, getSetting(currentKey));
                });
                textButton.addEventListener("click", function (event) {
                    var currentKey = event.target.parentNode.parentNode.dataset.settingsId;
                    WebJSInterface.setSetting(currentKey, getSetting(currentKey));
                });
            }
        }
    }
});

setSetting("showVersionNoteAgain", WebJSInterface.getSettingShowVersionNoteAgain());
