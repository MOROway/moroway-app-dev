const {app, ipcMain, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

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
var wakeLockId;

function newWindow(urlToLoad) {
    const win = new BrowserWindow(windowOptions);
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, urlToLoad),
            protocol: "file:",
            slashes: true
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
    newWindow("index.html");
});
