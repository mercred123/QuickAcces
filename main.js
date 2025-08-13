const {
  app,
  Tray,
  shell,
  BrowserWindow,
  ipcMain,
  clipboard,
} = require("electron");
const { exec } = require("child_process");
const path = require("path");

let Store;
let isFocused = false;

const {
  OpennerApp,
  CleanerTrash,
  CleanerTemp,
  NotepadPlusPlus,
  getLocalIP,
  getPublicIP,
  getFormattedDateTime,
  TaskManager,
  ControlPanel,
  ProgramFilesPath,
} = require("./systeme/utils.js");

let tray = null;
let popupWindow = null;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-trash-count", () => {
  return new Promise((resolve, reject) => {
    exec(
      'powershell "(New-Object -ComObject Shell.Application).NameSpace(10).Items().Count"',
      (err, stdout) => {
        if (err) {
          resolve(0);
        } else {
          const count = parseInt(stdout.trim(), 10) || 0;
          resolve(count);
        }
      }
    );
  });
});

app.whenReady().then(async () => {
  const StoreModule = await import("electron-store");
  Store = StoreModule.default;
  store = new Store();

  ipcMain.handle("get-settings", () => store.store);

  ipcMain.handle("set-setting", (event, key, value) => {
    store.set(key, value);
    return true;
  });

  ipcMain.handle("copy-ip", () => {
    const ip = getLocalIP();
    clipboard.writeText(ip);
  });

  ipcMain.handle("copy-public-ip", async () => {
    const ip = await getPublicIP();
    clipboard.writeText(ip);
  });

  ipcMain.handle("get-formatted-date-time", () => {
    const dateTime = getFormattedDateTime();
    clipboard.writeText(dateTime);
  });

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

  popupWindow.on("focus", () => {
    isFocused = true;
    popupWindow.webContents.send("focus-changed", true);
  });

  popupWindow.on("blur", () => {
    popupWindow.hide();
    isFocused = false;
    popupWindow.webContents.send("focus-changed", false);
  });

  ipcMain.handle("get-focus", () => {
    return isFocused;
  });

  ipcMain.handle("CleanerTrash", async () => {
    try {
      await CleanerTrash();
      return true;
    } catch {
      return false;
    }
  });

  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe"),
    });
  }

  tray = new Tray(path.join(__dirname, "assets/", "icon3.png"));

  const actionHandlers = {
    CleanerTemp: CleanerTemp,
    NotepadPlusPlus: NotepadPlusPlus,
    OpennerPaint: () => OpennerApp("mspaint"),
    OpennerCalc: () => OpennerApp("calc"),
    OpenChatGPT: () => shell.openExternal("https://chatgpt.com/"),
    OpenAppData: () => shell.openPath(app.getPath("appData")),
    TaskManager: TaskManager,
    ControlPanel: ControlPanel,
    ProgramFilesPath: ProgramFilesPath,
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
