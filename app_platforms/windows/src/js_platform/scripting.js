////Required code (needs to be set on each platform)

////Optional code (app works without it)
function placeOptions(state){

    var menu = {container: document.querySelector("#canvas-options"),containerMargin:0,team:document.querySelector("#canvas-team"),single:document.querySelector("#canvas-single"),help:document.querySelector("#canvas-help"), settings:document.querySelector("#canvas-settings"), controlCenter: document.querySelector("#canvas-control-center"), carControlCenter: document.querySelector("#canvas-car-control-center"), chat: document.querySelector("#canvas-chat-open")};
    if(state == "hide") {
        menu.container.style.display = "none";
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
            var settingsElem = document.querySelector("#settings");
            menu.settings.addEventListener("click", function(){
                menu.container.style.visibility = "hidden";
                settingsElem.style.display = "block";
                settingsElem.querySelector("#settings-help").style.display = menu.help.style.display == "none" ? "block" : "none";
            }, false);
            settingsElem.querySelector("#settings-apply").onclick = function(){
                settings = getSettings();
                if(typeof settingsElem.scrollTo == "function") {
                    settingsElem.scrollTo(0,0);
                }
                settingsElem.style.display = "";
                menu.container.style.visibility = "";
            };
            settingsElem.querySelector("#settings-help").onclick = function(){
                followLink("./help","_blank",LINK_STATE_INTERNAL_HTML);
            };
            menu.help.addEventListener("click", function(){followLink("help", "_blank", LINK_STATE_INTERNAL_HTML);}, false);
            menu.team.addEventListener("click", function(){followLink("?mode=multiplay", "_self", LINK_STATE_INTERNAL_HTML);}, false);
            menu.single.addEventListener("click", showConfirmLeaveMultiplayerMode, false);
            menu.controlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || controlCenter.showCarCenter; controlCenter.showCarCenter = false;}, false);
            menu.carControlCenter.addEventListener("click", function(){hardware.mouse.rightClick = !hardware.mouse.rightClick || !controlCenter.showCarCenter; controlCenter.showCarCenter = true;}, false);
            menu.chat.addEventListener("click", function(){
                document.querySelector("#chat").openChat();
            }, false);
            menu.changelog = document.createElement("button");
            var changelogChild = document.createElement("i");
            changelogChild.className = menu.help.querySelector("i").className;
            menu.changelog.appendChild(changelogChild);
            menu.changelog.className = menu.help.className;
            menu.changelog.id = "canvas-changelog";
            menu.changelog.title = getString("platformWindowsAppScreenChangelog");
            menu.changelog.addEventListener("click", function(){followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);}, false);
            menu.container.appendChild(menu.changelog);
            menu.feedback = document.createElement("button");
            var feedbackChild = document.createElement("i");
            feedbackChild.className = menu.help.querySelector("i").className;
            menu.feedback.appendChild(feedbackChild);
            menu.feedback.className = menu.help.className;
            menu.feedback.id = "canvas-feedback";
            menu.feedback.title = getString("platformWindowsAppScreenFeedback");
            menu.feedback.addEventListener("click", function(){followLink(getServerHTMLLink("feedback", "off"), "_blank", LINK_STATE_NORMAL);}, false);
            menu.container.appendChild(menu.feedback);
            menu.feedback.style.color = menu.changelog.style.color = menu.help.style.color = menu.settings.style.color = menu.team.style.color = menu.single.style.color = menu.controlCenter.style.color = menu.carControlCenter.style.color = menu.chat.style.color = "white";
            menu.feedback.style.background =  menu.changelog.style.background =  menu.help.style.background = menu.settings.style.background = menu.team.style.background = menu.single.style.background = menu.controlCenter.style.background = menu.carControlCenter.style.background = menu.chat.style.background = "black";
            menu.feedback.querySelector("i").style.fontFamily = menu.changelog.querySelector("i").style.fontFamily = menu.help.querySelector("i").style.fontFamily = menu.settings.querySelector("i").style.fontFamily = menu.team.querySelector("i").style.fontFamily = menu.single.querySelector("i").style.fontFamily = menu.controlCenter.querySelector("i").style.fontFamily = menu.carControlCenter.querySelector("i").style.fontFamily = menu.chat.querySelector("i").style.fontFamily = "'Segoe MDL2 Assets'";
            menu.feedback.querySelector("i").textContent = "\ue939";
            menu.changelog.querySelector("i").textContent = "\uedac";
            menu.help.querySelector("i").textContent = "\ue897";
            menu.settings.querySelector("i").textContent = "\ue713";
            menu.team.querySelector("i").textContent = "\ue716";
            menu.single.querySelector("i").textContent = "\ue77b";
            menu.controlCenter.querySelector("i").textContent = "\ue7c0";
            menu.carControlCenter.querySelector("i").textContent = "\ue7ec";
            menu.chat.querySelector("i").textContent = "\ue8bd";
        } else {
            menu.changelog = document.querySelector("#canvas-changelog");
            menu.feedback = document.querySelector("#canvas-feedback");
        }
        menu.containerMargin = client.height/50;
        menu.feedback.style.display = menu.changelog.style.display = menu.help.style.display = menu.settings.style.display = menu.controlCenter.style.display = menu.carControlCenter.style.display = "inline";
        menu.team.style.display = onlineGame.enabled ? "none" : "inline";
        menu.single.style.display = onlineGame.enabled ? "inline" : "none";
        menu.chat.style.display = onlineGame.enabled ? "inline" : "none";
        var items = [menu.feedback, menu.changelog, menu.carControlCenter, menu.controlCenter, menu.help, menu.settings, onlineGame.enabled ? menu.single : menu.team, menu.chat];
        var notJustOne = true;
        var number = 0;
        while (menu.container.offsetHeight+menu.containerMargin > client.y && menu.container.offsetWidth+menu.containerMargin > client.x && number < items.length-1) {
            if(number == items.length-2){
                notJustOne = false;
            }
            items[number].style.display = "none";
            number++;
        }
        if(notJustOne) {
            menu.container.style.top = menu.containerMargin + "px";
            menu.container.style.right = menu.containerMargin + "px";
        } else {
            menu.container.style.top = client.y + menu.containerMargin + "px";
            menu.container.style.right = client.x + menu.containerMargin + "px";
        }
    }
}

function appUpdateNotification() {
    var updater = document.querySelector("#canvas-changelog");
    if(updater !== null) {
        var color = updater.style.color;
        var background = updater.style.background;
        updater.addEventListener("click", function(){
            updater.style.color = color;
            updater.style.background = background;
        });
        updater.style.color = "red";
        updater.style.background = "#ffcccc";
        notify("#canvas-notifier", getString("appScreenHasUpdated", "!", "upper"), NOTIFICATION_PRIO_DEFAULT, 7000, null, null, client.y);
    }
}
