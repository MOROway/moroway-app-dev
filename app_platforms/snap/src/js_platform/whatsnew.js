window.addEventListener("load",function(){
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function(){
        (async () => {
            if(await _canGoBack.exec()) {
                _goBack.exec();
            } else {
                try {
                    window.close();
                } catch(err) {}
                followLink("./","_self", LINK_STATE_INTERNAL_HTML);
            }
        })();
    });
});
