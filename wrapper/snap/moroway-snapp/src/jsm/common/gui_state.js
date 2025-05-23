/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
//GUI STATE
export var ThreeCameraModes;
(function (ThreeCameraModes) {
    ThreeCameraModes["BIRDS_EYE"] = "birds-eye";
    ThreeCameraModes["FOLLOW_TRAIN"] = "follow-train";
    ThreeCameraModes["FOLLOW_CAR"] = "follow-car";
})(ThreeCameraModes || (ThreeCameraModes = {}));
function validateGuiState(item, test) {
    if (items.hasOwnProperty(item)) {
        return items[item].validate(test);
    }
    return false;
}
function getGuiStates() {
    var guiState = {};
    try {
        guiState = JSON.parse(window.localStorage.getItem("morowayAppGuiState") || "{}");
    }
    catch (e) {
        guiState = {};
    }
    return guiState;
}
export function getGuiState(item, overrideValue) {
    if (overrideValue === void 0) { overrideValue = undefined; }
    var value = getGuiStates()[item];
    if (overrideValue !== undefined && validateGuiState(item, overrideValue)) {
        return overrideValue;
    }
    else if (validateGuiState(item, value)) {
        return value;
    }
    else if (items.hasOwnProperty(item)) {
        return items[item].default;
    }
    return undefined;
}
export function setGuiState(item, value) {
    var guiState = getGuiStates();
    if (validateGuiState(item, value)) {
        guiState[item] = value;
    }
    window.localStorage.setItem("morowayAppGuiState", JSON.stringify(guiState));
}
var items = {
    "3d": {
        default: false,
        validate: function (test) {
            return typeof test == "boolean";
        }
    },
    "3d-night": {
        default: false,
        validate: function (test) {
            return typeof test == "boolean";
        }
    },
    "3d-cam-mode": {
        default: ThreeCameraModes.BIRDS_EYE,
        validate: function (test) {
            return Object.values(ThreeCameraModes).includes(test);
        }
    },
    "3d-follow-object": {
        default: 0,
        validate: function (test) {
            return typeof test == "number" && Number.isInteger(test) && test >= 0;
        }
    },
    "3d-rotation-speed": {
        default: 50,
        validate: function (test) {
            return typeof test == "number" && !Number.isNaN(test) && test >= 0 && test <= 100;
        }
    },
    "demo-random": {
        default: false,
        validate: function (test) {
            return typeof test == "boolean";
        }
    }
};
