function afterCalcOptionsMenuLocal(state) {
    if (state == "load") {
        for (var i = 0; i < menus.options.items.length; i++) {
            if (menus.options.items[i].id != "canvas-control-center" && menus.options.items[i].id != "canvas-car-control-center" && menus.options.items[i].id != "canvas-chat-open" && menus.options.items[i].id != "canvas-sound-toggle" && menus.options.items[i].id != "canvas-info-toggle") {
                menus.options.items[i].classList.add("hidden");
            }
        }
    }
}
