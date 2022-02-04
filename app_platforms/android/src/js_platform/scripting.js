////Required code (needs to be set on each platform)

////Optional code (app works without it)
function calcOptionsMenuLocal(state){
    if(state == "load") {
        for(var i = 0; i < optMenu.items.length; i++) {
            if(optMenu.items[i].id != "canvas-control-center" && optMenu.items[i].id !=  "canvas-car-control-center" && optMenu.items[i].id != "canvas-chat-open" ) {
                optMenu.items[i].classList.add("hidden");
            }
        }
    }
}
