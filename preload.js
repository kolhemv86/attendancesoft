const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  saveConfig: (value) => ipcRenderer.send("save-config", value),

  getConfig: () => ipcRenderer.invoke("get-config")
});