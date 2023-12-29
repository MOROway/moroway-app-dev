"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function () {
        WebJSInterface.goBack();
    });
});
