const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const fs = require("fs");
const path = require("path");
let tray = null;
let mainWindow;
const configPath = path.join(app.getPath("userData"), "config.json");

function createWindow(file) {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(file);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

   mainWindow.on("close", function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

 // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {

  tray = new Tray(path.join(__dirname, "icon.png")); // icon file mukjo

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Punching Data Software");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow.show();
  });

   // AUTO START ENABLE
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath("exe"),
  });

  if (fs.existsSync(configPath)) {
    createWindow("index.html");
  } else {
    createWindow("setup.html");
  }
});

// Save config
ipcMain.on("save-config", (event, value) => {
  fs.writeFileSync(configPath, JSON.stringify({ input1: value }));
  mainWindow.loadFile("index.html");
});

// Read config
ipcMain.handle("get-config", () => {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  }
  return null;
});