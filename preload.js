const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    CleanerTrash: () => ipcRenderer.send('CleanerTrash'),
    CleanerTemp: () => ipcRenderer.send('CleanerTemp'),
    NotepadPlusPlus: () => ipcRenderer.send('NotepadPlusPlus'),
    OpennerPaint: () => ipcRenderer.send('OpennerPaint'),
    OpennerCalc: () => ipcRenderer.send('OpennerCalc'),
    OpenChatGPT: () => ipcRenderer.send('OpenChatGPT'),
    OpenAppData: () => ipcRenderer.send('OpenAppData')
});