"use strict";
import { SYSTEM_TOOLS } from "{{jsm}}/common/system_tools.js";

document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", SYSTEM_TOOLS.navigateBack, false);
});
