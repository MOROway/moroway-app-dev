function calcOptionsMenuLocal(state) {
    if (state == "load") {
        for (var i = 0; i < optMenu.items.length; i++) {
            if (optMenu.items[i].id != "canvas-control-center" && optMenu.items[i].id != "canvas-car-control-center" && optMenu.items[i].id != "canvas-chat-open" && optMenu.items[i].id != "canvas-sound-toggle" && optMenu.items[i].id != "canvas-info-toggle") {
                optMenu.items[i].classList.add("hidden");
            }
        }
    }
}
