const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    CleanerTrash: () => ipcRenderer.invoke('CleanerTrash'),
    CleanerTemp: () => ipcRenderer.send('CleanerTemp'),
    NotepadPlusPlus: () => ipcRenderer.send('NotepadPlusPlus'),
    OpennerPaint: () => ipcRenderer.send('OpennerPaint'),
    OpennerCalc: () => ipcRenderer.send('OpennerCalc'),
    OpenChatGPT: () => ipcRenderer.send('OpenChatGPT'),
    OpenAppData: () => ipcRenderer.send('OpenAppData'),
    getTrashCount: () => ipcRenderer.invoke('get-trash-count'),
    onFocusChange: (callback) => {
      ipcRenderer.on('focus-changed', (event, isFocused) => {
        callback(isFocused);
      });
    },
    copyIP: () => ipcRenderer.invoke('copy-ip'),
    copyPublicIP: () => ipcRenderer.invoke('copy-public-ip'),
    getFormattedDateTime: () => ipcRenderer.invoke('get-formatted-date-time'),
    TaskManager: () => ipcRenderer.send('TaskManager'),
    ControlPanel: () => ipcRenderer.send('ControlPanel'),
    ProgramFilesPath: () => ipcRenderer.send('ProgramFilesPath'),
    incrementButton: () => ipcRenderer.send("increment-button"),
    getStats: () => ipcRenderer.invoke("get-stats"),
});

contextBridge.exposeInMainWorld('settingsAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});