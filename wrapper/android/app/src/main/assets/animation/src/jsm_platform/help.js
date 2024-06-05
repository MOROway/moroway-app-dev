/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL} from "./common/follow_links.js";
import {getString} from "../jsm/common/string_tools.js";
import {handleServerJSONValues, getServerHTMLLink} from "../jsm/common/web_tools.js";
import {notify, NOTIFICATION_PRIO_DEFAULT} from "../jsm/common/notify.js";
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function () {
        WebJSInterface.goBack();
    });

    document.querySelector("#legal-appandroid-licenses").classList.remove("hidden");
    document.querySelector("#legal-appandroid-kotlin-license").addEventListener("click", function () {
        followLink("licenses_platform/org.jetbrains.kotlin.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appandroid-android-x-appcompat-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.appcompat.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appandroid-android-x-activity-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.activity.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appandroid-android-x-webkit-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.webkit.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appandroid-picasso-license").addEventListener("click", function () {
        followLink("licenses_platform/com.squareup.picasso.txt", "_self", LINK_STATE_INTERNAL_LICENSE);
    });

    document.querySelector("#privacy-statement-link").addEventListener("click", function () {
        notify("#help-notifier", getString("helpScreenPrivacyStatementBackupLinkNotification", "."), NOTIFICATION_PRIO_DEFAULT, 900, null, null, window.innerHeight);
        followLink(getServerHTMLLink("privacy"), "_blank", LINK_STATE_NORMAL);
    });
    handleServerJSONValues("privacy", function (res) {
        var privacy = document.querySelector("#privacy-statement");
        privacy.innerHTML = "";
        Object.keys(res).forEach(function (key) {
            var span = document.createElement("span");
            span.textContent = res[key];
            privacy.innerHTML += "<br>";
            privacy.appendChild(span);
        });
    });

    var about = document.querySelector("#website-about");
    handleServerJSONValues("about", function (res) {
        if (typeof res == "object" && Array.isArray(res)) {
            res.forEach(function (aboutText) {
                var p = document.createElement("p");
                p.textContent = aboutText;
                about.querySelector("#website-about-text").appendChild(p);
            });
            about.style.display = "block";
        }
    });
});
