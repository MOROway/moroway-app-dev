"use strict";
import { formatHTMLString, formatJSString, getString, searchStringKeys, setHTMLStrings } from "./common/string_tools.js";
import { SYSTEM_TOOLS } from "./common/system_tools.js";
import { initTooltips } from "./common/tooltip.js";

document.addEventListener("DOMContentLoaded", function () {
    function createCardForMinor(major: number, element: HTMLElement, newestFamily: boolean) {
        function createDetailsOnPatches(major: number, minor: number, element: HTMLElement) {
            const patches = searchStringKeys(RegExp("whatsNewScreenByVersionMa" + major + "Mi" + minor + "Pa[1-9][0-9]*"));
            if (patches.length == 0) {
                return;
            }
            patches.sort(new Intl.Collator(undefined, {numeric: true}).compare);
            const subElementPatches = document.createElement("details");
            subElementPatches.name = "patches";
            const subElementPatchesSummary = document.createElement("summary");
            subElementPatchesSummary.textContent = getString("whatsNewScreenPatchesDetail");
            subElementPatches.appendChild(subElementPatchesSummary);
            var addedContent = false;
            patches.forEach((key) => {
                var currentlyAddedContent = false;
                const patch = parseInt(key.replace("whatsNewScreenByVersionMa" + major + "Mi" + minor + "Pa", ""), 10);
                const subElementPatchesContent = document.createElement("p");
                var subElementPatchesIntro = document.createElement("i");
                subElementPatchesIntro.textContent = formatJSString(getString("whatsNewScreenPatchesPatch", ": "), patch) + formatJSString(getString([key, 0]));
                subElementPatchesContent.appendChild(subElementPatchesIntro);
                var m = 1;
                while (m > 0) {
                    if (getString([key, m]) != "undefined") {
                        var subElementPatchesBr = document.createElement("br");
                        subElementPatchesContent.appendChild(subElementPatchesBr);
                        var subElementPatchesSpan = document.createElement("span");
                        subElementPatchesSpan.textContent = formatJSString(getString([key, m]));
                        subElementPatchesContent.appendChild(subElementPatchesSpan);
                        m++;
                    } else {
                        if (m > 1) {
                            currentlyAddedContent = true;
                            addedContent = true;
                        }
                        m = 0;
                    }
                }
                if (currentlyAddedContent) {
                    subElementPatches.appendChild(subElementPatchesContent);
                }
            });
            if (addedContent) {
                element.appendChild(subElementPatches);
            }
        }

        const minors = searchStringKeys(RegExp("whatsNewScreenByVersionMa" + major + "Mi[0-9]+Pa0"));
        if (minors.length == 0) {
            return;
        }
        minors.sort(new Intl.Collator(undefined, {numeric: true}).compare);
        minors.forEach((key, index) => {
            const minor = parseInt(key.replace(RegExp("whatsNewScreenByVersionMa" + major + "Mi([0-9]+)Pa0"), "$1"), 10);
            const subElement = document.createElement("div");
            if (newestFamily && index == minors.length - 1) {
                subElement.id = "newest";
            }
            subElement.className = "card";
            const subElementTitle = document.createElement("div");
            subElementTitle.className = "card-title";
            const subElement2 = document.createElement("h2");
            subElement2.textContent = formatJSString(getString("whatsNewScreenVersionNumberMinor"), major, minor);
            subElementTitle.appendChild(subElement2);
            subElement.appendChild(subElementTitle);
            const subElementContent = document.createElement("div");
            subElementContent.className = "card-content";
            const subElementContentInner = document.createElement("p");
            const subElementContentInnerText = document.createElement("i");
            subElementContentInnerText.textContent = formatJSString(getString([key, 0]));
            subElementContentInner.appendChild(subElementContentInnerText);
            subElementContent.appendChild(subElementContentInner);
            const subElementContentInner2 = document.createElement("p");
            var i = 1;
            while (i > 0) {
                if (getString([key, i]) != "undefined") {
                    if (i > 1) {
                        var subElementContentInner2Br = document.createElement("br");
                        subElementContentInner2.appendChild(subElementContentInner2Br);
                    }
                    var subElementContentInner2Span = document.createElement("span");
                    subElementContentInner2Span.innerHTML = formatJSString(formatHTMLString(getString([key, i])), "<b>" + formatHTMLString(getString("whatsNewScreenVersionIsNew", "", "upper")) + "</b>! ");
                    subElementContentInner2.appendChild(subElementContentInner2Span);
                    i++;
                } else {
                    i = 0;
                }
            }
            subElementContent.appendChild(subElementContentInner2);
            createDetailsOnPatches(major, minor, subElementContent);
            subElement.appendChild(subElementContent);
            element.appendChild(subElement);
        });
    }

    const backButton: HTMLElement = document.querySelector("#backOption");
    backButton.addEventListener("click", function () {
        SYSTEM_TOOLS.navigateBack();
    });

    const versions = searchStringKeys(RegExp("whatsNewScreenByVersionMa[0-9]+Mi0Pa0"));
    if (versions.length > 0) {
        versions.sort(new Intl.Collator(undefined, {numeric: true}).compare).reverse();
        versions.forEach((key, index) => {
            const major = parseInt(key.replace(RegExp("whatsNewScreenByVersionMa([0-9]+)Mi0Pa0"), "$1"), 10);
            const elem = document.createElement("article");
            elem.id = "v" + major;
            const elemTitle = document.createElement("h2");
            elemTitle.textContent = formatJSString(getString("whatsNewScreenVersionNumber"), major);
            elem.appendChild(elemTitle);
            const elemContent = document.createElement("div");
            elemContent.className = "card-container card-container-highlightable";
            createCardForMinor(major, elemContent, index == 0);
            elem.appendChild(elemContent);
            (document.querySelector("main") as HTMLElement).appendChild(elem);
        });
    }

    setHTMLStrings();
    initTooltips();
});
