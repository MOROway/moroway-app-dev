/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
window.addEventListener("error", function (e) {
    WebJSInterface.throwError(e.message);
});
