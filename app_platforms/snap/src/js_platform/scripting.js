function afterCalcOptionsMenuLocal(state) {
    if (state == "load") {
        if (!onlineGame.enabled) {
            showServerNote();
        }
        setSettingsHTML(document.querySelector("#settings-inner"), false);
        exitItem = menus.options.items[0].cloneNode(true);
        exitItem.id = "canvas-platform-exit";
        exitItem.title = getString("platformSnapAppExit");
        exitItem.querySelector("i").textContent = "close";
        exitItem.addEventListener("click", _exitApp.exec);
        menus.options.container.elementInner.appendChild(exitItem);
    }
}

function appReadyNotification() {
    notify(
        "#canvas-notifier",
        getString("appScreenHasLoaded", "."),
        NOTIFICATION_PRIO_DEFAULT,
        4000,
        function () {
            followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);
        },
        getString("generalTitleHelpScreen", "", "upper"),
        client.y + menus.outerContainer.height
    );
}

function appUpdateNotification() {
    notify(
        "#canvas-notifier",
        getString("appScreenHasUpdated", "!", "upper"),
        NOTIFICATION_PRIO_DEFAULT,
        7000,
        function () {
            followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);
        },
        "Mehr Informationen",
        client.y + menus.outerContainer.height
    );
}
