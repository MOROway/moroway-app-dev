window.addEventListener("error", function () {
    var body = document.querySelector("body");
    body.style.background = "#110022";
    body.innerHTML = '<div id="error-element">FATAL ERROR</div>';
});
