const { app, Tray, shell, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let Store;

const {
  OpennerApp,
  CleanerTrash,
  CleanerTemp,
  NotepadPlusPlus,
} = require("./systeme/utils.js");

let tray = null;
let popupWindow = null;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

(async () => {
  Store = (await import("electron-store")).default;
  store = new Store();

  ipcMain.handle("get-settings", () => {
    return store.store;
  });

  ipcMain.handle("set-setting", (event, key, value) => {
    store.set(key, value);
    return true;
  });
})();

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

app.whenReady().then(() => {
  popupWindow = new BrowserWindow({
    width: 300,
    height: 550,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  popupWindow.loadFile(path.join(__dirname, "popup", "popup.html"));

  popupWindow.on("blur", () => {
    popupWindow.hide();
  });
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath("exe"),
  });

  tray = new Tray(path.join(__dirname, "assets/", "icon3.png"));

  const actionHandlers = {
    CleanerTrash: CleanerTrash,
    CleanerTemp: CleanerTemp,
    NotepadPlusPlus: NotepadPlusPlus,
    OpennerPaint: () => OpennerApp("mspaint"),
    OpennerCalc: () => OpennerApp("calc"),
    OpenChatGPT: () => shell.openExternal("https://chatgpt.com/"),
    OpenAppData: () => shell.openPath(app.getPath("appData")),
  };

  for (const [actionName, handler] of Object.entries(actionHandlers)) {
    ipcMain.on(actionName, () => {
      handler();
    });
  }

  tray.setToolTip("QuickAcces");
  tray.on("click", (event, bounds) => {
    if (popupWindow.isVisible()) {
      popupWindow.hide();
    } else {
      const { x, y } = bounds;
      const { width, height } = popupWindow.getBounds();
      const trayX = x - Math.round(width / 2);
      const trayY = y - height;
      popupWindow.setBounds({ x: trayX, y: trayY, width, height });
      popupWindow.show();
      popupWindow.focus();
    }
  });
});
