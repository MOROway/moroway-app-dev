"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
import {setHTMLStrings} from "../jsm/common/string_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("demo-mode-go").addEventListener("click", function () {
        var cameraMode = "birds-eye";
        if (document.getElementById("demo-mode-3d-camera-mode-follow-train").checked) {
            cameraMode = "follow-train";
        } else if (document.getElementById("demo-mode-3d-camera-mode-follow-car").checked) {
            cameraMode = "follow-car";
        }
        const url = "./?mode=demoStandalone&gui-3d=" + (document.getElementById("demo-mode-3d").checked ? 1 : 0) + "&gui-3d-night=" + (document.getElementById("demo-mode-3d-night").checked ? 1 : 0) + "&gui-demo-3d-rotation-speed-percent=" + document.getElementById("demo-mode-3d-rotation-speed").value + "&gui-3d-cam-mode=" + cameraMode;
        followLink(url, "_self", LINK_STATE_INTERNAL_HTML);
    });
    document.getElementById("demo-mode-3d").addEventListener("change", function () {
        document.getElementById("demo-mode-3d-only").style.display = document.getElementById("demo-mode-3d").checked ? "" : "none";
    });
    const cameraModes = document.querySelectorAll("input[type=radio][name=demo-mode-3d-camera-mode]");
    for (let i = 0; i < cameraModes.length; i++) {
        cameraModes[i].addEventListener("change", function () {
            document.getElementById("demo-mode-3d-birdseye-only").style.display = document.getElementById("demo-mode-3d-camera-mode-birds-eye").checked ? "" : "none";
        });
    }
    document.getElementById("demo-mode-3d-only").style.display = document.getElementById("demo-mode-3d").checked ? "" : "none";
    document.getElementById("demo-mode-3d-birdseye-only").style.display = document.getElementById("demo-mode-3d-camera-mode-birds-eye").checked ? "" : "none";

    setHTMLStrings();
});

document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
    });
});
