/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
window.addEventListener("error", function (e) {
    WebJSInterface.throwError(e.message);
});
