const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("_openExternalLink", {exec: (url) => ipcRenderer.invoke("openExternalLink", url)});
contextBridge.exposeInMainWorld("_openNormalLink", {exec: (url) => ipcRenderer.invoke("openNormalLink", url)});
contextBridge.exposeInMainWorld("_canGoBack", {exec: () => ipcRenderer.invoke("canGoBack")});
contextBridge.exposeInMainWorld("_goBack", {exec: () => ipcRenderer.invoke("goBack")});
contextBridge.exposeInMainWorld("_exitApp", {exec: () => ipcRenderer.invoke("exitApp")});
contextBridge.exposeInMainWorld("_keepScreenAlive", {exec: (acquire) => ipcRenderer.invoke("keepScreenAlive", acquire)});
