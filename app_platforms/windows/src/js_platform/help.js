////Required code (needs to be set on each platform)

////Optional code (app works without it)
function init_local(){
    var pics = document.querySelector("#website-pics");
    pics.style.display = "none";
    handleServerJSONValues("webpics", function(res){
        if(typeof(res.pics) == "object") {
            res.pics.forEach(function(pic){
                var img = document.createElement("div");
                img.onclick = function(){followLink(pic.links.normal,"_blank", LINK_STATE_NORMAL);};
                img.style.backgroundImage = "url('" + pic.urls.thumb.url + "')";
                pics.appendChild(img);
            });
            pics.style.display = "";
        }
    });
}
