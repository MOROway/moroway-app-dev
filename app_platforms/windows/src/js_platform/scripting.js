function calcOptionsMenuLocal(state) {
    if (state == "load") {
        if (!onlineGame.enabled) {
            showServerNote();
        }
        setSettingsHTML(document.querySelector("#settings-inner"), false);
    }
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
