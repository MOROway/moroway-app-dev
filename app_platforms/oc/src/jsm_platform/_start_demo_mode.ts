"use strict";
import { setHTMLStrings } from "{{jsm}}/common/string_tools.js";
import { SYSTEM_TOOLS } from "{{jsm}}/common/system_tools.js";
import { followLink, LinkStates } from "{{jsm}}/common/web_tools.js";

document.addEventListener("DOMContentLoaded", function () {
    const demoModeGo = document.getElementById("demo-mode-go");
    const demoModeContainerManual = document.getElementById("demo-mode-manual-only");
    const demoModeContainer3D = document.getElementById("demo-mode-3d-only");
    const demoModeContainer3DBirdsEye = document.getElementById("demo-mode-3d-birdseye-only");
    const demoModeInputRandom = document.getElementById("demo-mode-random") as HTMLInputElement;
    const demoModeInputExitTimeout = document.getElementById("demo-mode-exit-timeout") as HTMLInputElement;
    const demoModeInput3D = document.getElementById("demo-mode-3d") as HTMLInputElement;
    const demoModeInput3DCamModeBirdsEye = document.getElementById("demo-mode-3d-camera-mode-birds-eye") as HTMLInputElement;
    const demoModeInput3DCamModeFollowTrain = document.getElementById("demo-mode-3d-camera-mode-follow-train") as HTMLInputElement;
    const demoModeInput3DCamModeFollowCar = document.getElementById("demo-mode-3d-camera-mode-follow-car") as HTMLInputElement;
    demoModeGo.addEventListener("click", function () {
        var cameraMode = "birds-eye";
        if (demoModeInput3DCamModeFollowTrain.checked) {
            cameraMode = "follow-train";
        } else if (demoModeInput3DCamModeFollowCar.checked) {
            cameraMode = "follow-car";
        }
        const url = "./?mode=demoStandalone&gui-3d=" + (demoModeInput3D.checked ? 1 : 0) + "&gui-3d-night=" + ((document.getElementById("demo-mode-3d-night") as HTMLInputElement).checked ? 1 : 0) + "&gui-demo-3d-rotation-speed-percent=" + parseInt((document.getElementById("demo-mode-3d-rotation-speed") as HTMLInputElement).value, 10) + "&gui-3d-cam-mode=" + cameraMode + "&gui-demo-random=" + (demoModeInputRandom.checked ? 1 : 0) + (demoModeInputExitTimeout.value !== "" ? "&exit-timeout=" + parseInt(demoModeInputExitTimeout.value, 10) : "");
        followLink(url, "_self", LinkStates.InternalHtml);
    });
    demoModeInputRandom.addEventListener("change", function () {
        demoModeContainerManual.style.display = demoModeInputRandom.checked ? "none" : "";
    });
    demoModeInput3D.addEventListener("change", function () {
        demoModeContainer3D.style.display = demoModeInput3D.checked ? "" : "none";
    });
    const cameraModes = document.querySelectorAll("input[type=radio][name=demo-mode-3d-camera-mode]");
    for (let i = 0; i < cameraModes.length; i++) {
        cameraModes[i].addEventListener("change", function () {
            demoModeContainer3DBirdsEye.style.display = demoModeInput3DCamModeBirdsEye.checked ? "" : "none";
        });
    }
    demoModeContainerManual.style.display = demoModeInputRandom.checked ? "none" : "";
    demoModeContainer3D.style.display = demoModeInput3D.checked ? "" : "none";
    demoModeContainer3DBirdsEye.style.display = demoModeInput3DCamModeBirdsEye.checked ? "" : "none";

    setHTMLStrings();
});

document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", SYSTEM_TOOLS.navigateBack, false);
});
