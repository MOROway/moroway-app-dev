////Required code (needs to be set on each platform)
function init_local() {
    document.querySelector("#download-androidlink").addEventListener("click", function(){followLink(getServerRedirectLink("download_android"),"_blank", LINK_STATE_NORMAL);});
    document.querySelector("#download-fdroidlink").addEventListener("click", function(){followLink(getServerRedirectLink("download_fdroid"),"_blank", LINK_STATE_NORMAL);});
    document.querySelector("#download-windowslink").addEventListener("click", function(){followLink(getServerRedirectLink("download_windows"),"_blank", LINK_STATE_NORMAL);});
}

////Optional code (app works without it)
