window.addEventListener("error", function (event) {
    // Android wrapper contains WebJSInterface
    // @ts-ignore
    WebJSInterface.throwError(event.message);
});
