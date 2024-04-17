const {app, ipcMain, BrowserWindow} = require("electron");
const process = require("process");
const path = require("path");
const url = require("url");

var wakeLockId;

function newWindow(urlToLoad) {
    const windowOptions = {
        fullscreen: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "icon.png"),
        webPreferences: {
            nativeWindowOpen: true,
            devTools: false,
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    };
    const win = new BrowserWindow(windowOptions);
    var targetString = "";
    var queryString = "";
    if (urlToLoad.indexOf("#") > -1) {
        targetString = urlToLoad.replace(/^.*[#]/, "");
        urlToLoad = urlToLoad.replace(/[#].*/, "");
    }
    if (urlToLoad.indexOf("?") > -1) {
        queryString = urlToLoad.replace(/^.*[?]/, "");
        urlToLoad = urlToLoad.replace(/[?].*/, "");
    }
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, urlToLoad),
            protocol: "file:",
            slashes: true,
            search: queryString,
            hash: targetString
        })
    );
}
function resolveArg(arg) {
    return new Promise((resolve) => {
        resolve(arg);
    });
}

ipcMain.handle("openExternalLink", async (event, arg) => {
    const url = await resolveArg(arg);
    require("electron").shell.openExternal(url);
});
ipcMain.handle("openNormalLink", async (event, arg) => {
    const urlToLoad = await resolveArg(arg);
    newWindow(urlToLoad);
});
ipcMain.handle("canGoBack", async (event, arg) => {
    return BrowserWindow.getFocusedWindow().webContents.canGoBack();
});
ipcMain.handle("goBack", async (event, arg) => {
    BrowserWindow.getFocusedWindow().webContents.goBack();
});
ipcMain.handle("exitApp", async (event) => {
    app.quit();
});
ipcMain.handle("keepScreenAlive", async (event, arg) => {
    const acquire = await resolveArg(arg);
    const {powerSaveBlocker} = require("electron");
    if (wakeLockId != undefined) {
        powerSaveBlocker.stop(wakeLockId);
    }
    if (acquire) {
        wakeLockId = powerSaveBlocker.start("prevent-display-sleep");
    }
});

app.on("ready", function () {
    const urlSearchParams = new URLSearchParams();
    process.argv.forEach((arg) => {
        if (arg.startsWith("--") && arg.indexOf("=") > -1) {
            const key = arg.replace(/^--/, "").replace(/=.*$/, "");
            const value = arg.replace(/^.*=/, "");
            urlSearchParams.append(key, value);
        }
    });
    const queryString = "?" + urlSearchParams.toString();
    newWindow("index.html" + queryString);
});
