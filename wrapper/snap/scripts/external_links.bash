#!/bin/bash
cd $(dirname "$0")/../platforms/electron/platform_www/
file=cdv-electron-main.js
if [[ -z $(cat "$file" | grep "MOROway Code" ) ]]; then
    echo  "/* MOROway Code */function resolveURL(url) {return new Promise(resolve => {resolve(url)})}; ipcMain.handle('openExternalLink', async (event, arg) => {const url = await resolveURL(arg); require('electron').shell.openExternal(url);});" >> "$file"
    echo  "/* MOROway Code */ipcMain.handle('exitApp', async (event) => {app.quit();});" >> "$file"
fi
file=cdv-electron-preload.js
if [[ -z $(cat "$file" | grep "MOROway Code" ) ]]; then
    echo "/* MOROway Code */contextBridge.exposeInMainWorld('_openExternalLink', {exec: (url) => ipcRenderer.invoke('openExternalLink', url)});" >> "$file"
    echo "/* MOROway Code */contextBridge.exposeInMainWorld('_exitApp', {exec: () => ipcRenderer.invoke('exitApp')});" >> "$file"
fi
