////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){

    var menu = {container: document.querySelector("#canvas-options"),containerMargin:client.width/50,items: {team:document.querySelector("#canvas-team"),single:document.querySelector("#canvas-single"),help:document.querySelector("#canvas-help"), settings:document.querySelector("#canvas-settings"), controlCenter: document.querySelector("#canvas-control-center"), carControlCenter: document.querySelector("#canvas-car-control-center"), chat: document.querySelector("#canvas-chat-open")}};
    if(state == "hide") {
        menu.container.style.display = "";
    } else if (state == "show") {
        menu.container.style.display = "block";
    } else if (state == "invisible") {
        menu.container.style.visibility = "hidden";
    } else if (state == "visible") {
        menu.container.style.visibility = "";
    } else {
        if(state == "load") {
            menu.container.style.display = "block";
            if(!onlineGame.enabled) {
                showServerNote();
            }
            setSettingsHTML(document.querySelector("#settings-inner"),false);
            menu.items.help.addEventListener("click", function(){followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);});
            menu.items.team.addEventListener("click", function(){followLink("?mode=multiplay", "_self", LINK_STATE_INTERNAL_HTML);});
            menu.items.single.addEventListener("click", showConfirmLeaveMultiplayerMode);
            var settingsElem = document.querySelector("#settings");
            menu.items.settings.addEventListener("click", function(){
                menu.container.style.visibility = "hidden";
                settingsElem.style.display = "block";
                settingsElem.querySelector("#settings-help").style.display = menu.items.help.style.display == "none" ? "block" : "none";
            });
            settingsElem.querySelector("#settings-apply").onclick = function(){
                settings = getSettings();
                settingsElem.scrollTo(0,0);
                settingsElem.style.display = "";
                menu.container.style.visibility = "";
            };
            settingsElem.querySelector("#settings-help").onclick = function(){
                followLink("./help","_blank",LINK_STATE_INTERNAL_HTML);
            };
            menu.items.controlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || controlCenter.showCarCenter; controlCenter.showCarCenter = false;});
            menu.items.carControlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || !controlCenter.showCarCenter; controlCenter.showCarCenter = true;});
            menu.items.chat.addEventListener("click", function(){
                document.querySelector("#chat").openChat();
            });
        }
        for (var item in menu.items) {
            menu.items[item].style.display = "inline";
            menu.items[item].classList.remove("small");
        }
        menu.items.team.style.display = onlineGame.enabled ? "none" : "inline";
        menu.items.single.style.display = onlineGame.enabled ? "inline" : "none";
        menu.items.chat.style.display = onlineGame.enabled ? "inline" : "none";
        if(menu.container.offsetHeight < client.y && 2*background.y > background.height) {
            menu.containerMargin = (client.y-menu.container.offsetHeight)/2;
            menu.container.style.top = "";
            menu.container.style.right = client.width/2-menu.container.offsetWidth/2 + "px";
            menu.container.style.bottom =  menu.containerMargin +  "px";
        } else if (menu.container.offsetHeight < client.y) {
            menu.containerMargin = (client.y- menu.container.offsetHeight)/2;
            menu.container.style.top = "";
            menu.container.style.right =  menu.containerMargin + "px";
            menu.container.style.bottom =  menu.containerMargin +  "px";
        } else if (menu.container.offsetWidth + menu.containerMargin * 2 < client.x) {
            menu.container.style.bottom = "";
            menu.container.style.right = client.x/2-menu.container.offsetWidth/2 + "px";
            menu.container.style.top = client.height/2-menu.container.offsetHeight/2 +  "px";
        } else {
            for (var item in menu.items) {
                menu.items[item].classList.add("small");
            }
            menu.items.help.style.display = menu.items.controlCenter.style.display = menu.items.carControlCenter.style.display = "none";
            menu.container.style.bottom = "";
            menu.container.style.right = client.x + menu.containerMargin + "px";
            menu.container.style.top = client.y + menu.containerMargin + "px";

        }
    }
}

function appReadyNotification() {
    notify("#canvas-notifier", getString("appScreenHasLoaded", "."), NOTIFICATION_PRIO_DEFAULT, 4000, function(){followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);}, getString("generalTitleHelpScreen","","upper"), client.y);
}

function appUpdateNotification() {
    notify("#canvas-notifier", getString("appScreenHasUpdated", "!", "upper"), NOTIFICATION_PRIO_DEFAULT, 7000, function(){followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);}, "Mehr Informationen", client.y);
}
