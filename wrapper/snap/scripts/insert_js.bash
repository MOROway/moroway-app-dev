#!/bin/bash
cd $(dirname "$0")/../res/electron/ || exit 1
browserWindow="$(cat settings.json | perl -0pe 's/[\n\s"]//g' | sed 's/[^:]*://' | sed 's/}}}$/,preload:path.join(app.getAppPath(),"cdv-electron-preload.js")}, icon: appIcon}/')"
cd ../../platforms/electron/platform_www/ || exit 2
file=cdv-electron-main.js
content=$(cat "$file" | perl -0pe "s#/\* MOROway Code \*/.*##g")
echo "$content" >"$file"
echo '/* MOROway Code */let appIcon;if(fs.existsSync(`${__dirname}/img/app.png`)){appIcon=`${__dirname}/img/app.png`;}else if(fs.existsSync(`${__dirname}/img/icon.png`)){appIcon=`${__dirname}/img/icon.png`;}else{appIcon=`${__dirname}/img/logo.png`;}' >>"$file"
echo "/* MOROway Code */function resolveArg(arg) {return new Promise(resolve => {resolve(arg)})};" >>"$file"
echo "/* MOROway Code */ipcMain.handle('openExternalLink', async (event, arg) => {const url = await resolveArg(arg); require('electron').shell.openExternal(url);});" >>"$file"
echo "/* MOROway Code */ipcMain.handle('openNormalLink', async (event, arg) => {const url = await resolveArg(arg); (new (require('electron').BrowserWindow)($browserWindow)).loadURL(basePath+'/'+url);});" >>"$file"
echo "/* MOROway Code */ipcMain.handle('canGoBack', async (event, arg) => {return BrowserWindow.getFocusedWindow().webContents.canGoBack()});" >>"$file"
echo "/* MOROway Code */ipcMain.handle('goBack', async (event, arg) => {BrowserWindow.getFocusedWindow().webContents.goBack()});" >>"$file"
echo "/* MOROway Code */ipcMain.handle('exitApp', async (event) => {app.quit();});" >>"$file"
echo '/* MOROway Code */var wakeLockId;' >>"$file"
echo "/* MOROway Code */ipcMain.handle('keepScreenAlive', async (event, arg) => {const acquire = await resolveArg(arg); const {powerSaveBlocker} = require('electron'); if(wakeLockId != undefined){powerSaveBlocker.stop(wakeLockId);} if(acquire){wakeLockId = powerSaveBlocker.start('prevent-display-sleep');}});" >>"$file"
file=cdv-electron-preload.js
content=$(cat "$file" | perl -0pe "s#/\* MOROway Code \*/.*##g")
echo "$content" >"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_openExternalLink', {exec: (url) => ipcRenderer.invoke('openExternalLink', url)});" >>"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_openNormalLink', {exec: (url) => ipcRenderer.invoke('openNormalLink', url)});" >>"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_canGoBack', {exec: () => ipcRenderer.invoke('canGoBack')});" >>"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_goBack', {exec: () => ipcRenderer.invoke('goBack')});" >>"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_exitApp', {exec: () => ipcRenderer.invoke('exitApp')});" >>"$file"
echo "/* MOROway Code */contextBridge.exposeInMainWorld('_keepScreenAlive', {exec: (acquire) => ipcRenderer.invoke('keepScreenAlive', acquire)});" >>"$file"
