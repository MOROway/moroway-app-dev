"use strict";
import { NotificationPriority, notify } from "{{jsm}}/common/notify.js";
import { getString } from "{{jsm}}/common/string_tools.js";
import { followLink, getServerHTMLLink, handleServerJSONValues, LinkStates } from "{{jsm}}/common/web_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", function () {
                WebJSInterface.goBack();
            });
        }
    }

    document.querySelector("#legal-appandroid-licenses").classList.remove("hidden");
    document.querySelector("#legal-appandroid-kotlin-license").addEventListener("click", function () {
        followLink("licenses_platform/org.jetbrains.kotlin.txt", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appandroid-android-x-appcompat-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.appcompat.txt", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appandroid-android-x-activity-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.activity.txt", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appandroid-android-x-webkit-license").addEventListener("click", function () {
        followLink("licenses_platform/androidx.webkit.txt", "_self", LinkStates.InternalLicense);
    });
    document.querySelector("#legal-appandroid-picasso-license").addEventListener("click", function () {
        followLink("licenses_platform/com.squareup.picasso.txt", "_self", LinkStates.InternalLicense);
    });

    document.querySelector("#privacy-statement-link").addEventListener("click", function () {
        notify("#help-notifier", getString("helpScreenPrivacyStatementBackupLinkNotification", "."), NotificationPriority.Default, 900, null, null, window.innerHeight);
        followLink(getServerHTMLLink("privacy"), "_blank", LinkStates.External);
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
