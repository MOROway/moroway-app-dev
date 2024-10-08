const {app, ipcMain, BrowserWindow} = require("electron");
var wakeLockId;

function newWindow(urlToLoad) {
    const path = require("path");
    const windowOptions = {
        fullscreen: true,
        menuBarVisible: false,
        titleBarStyle: "hidden",
        frame: false,
        icon: path.join(__dirname, "icon.png"),
        webPreferences: {
            nativeWindowOpen: true,
            devTools: false,
            sandbox: false,
            preload: path.join(__dirname, "preload.js")
        }
    };
    const win = new BrowserWindow(windowOptions);
    const url = new URL("file://" + path.join(__dirname, urlToLoad));
    win.loadURL(url.toString());
}

function resolveArg(arg) {
    return new Promise((resolve) => {
        resolve(arg);
    });
}

ipcMain.handle("openExternalLink", async (_event, arg) => {
    const url = await resolveArg(arg);
    require("electron").shell.openExternal(url);
});
ipcMain.handle("openNormalLink", async (_event, arg) => {
    const urlToLoad = await resolveArg(arg);
    newWindow(urlToLoad);
});
ipcMain.handle("canGoBack", async () => {
    return BrowserWindow.getFocusedWindow().webContents.navigationHistory.canGoBack();
});
ipcMain.handle("goBack", async () => {
    BrowserWindow.getFocusedWindow().webContents.navigationHistory.goBack();
});
ipcMain.handle("exitApp", async () => {
    app.quit();
});
ipcMain.handle("keepScreenAlive", async (_event, arg) => {
    const {powerSaveBlocker} = require("electron");
    const acquire = await resolveArg(arg);
    if (wakeLockId != undefined) {
        powerSaveBlocker.stop(wakeLockId);
    }
    if (acquire) {
        wakeLockId = powerSaveBlocker.start("prevent-display-sleep");
    }
});

app.on("ready", function () {
    const process = require("process");
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
