/**
 * Copyright 2026 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
window.addEventListener("error", function (event) {
    // Android wrapper contains WebJSInterface
    // @ts-ignore
    WebJSInterface.throwError(event.message);
});
