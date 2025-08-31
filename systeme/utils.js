const { exec } = require("child_process");
const os = require('os');
const https = require('https');
const { shell, app } = require("electron");

function OpennerApp(app) {
    exec(`${app}`)
}

function CleanerTrash() {
  return new Promise((resolve, reject) => {
    exec('PowerShell.exe -Command "Clear-RecycleBin -Force"', (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function CleanerTemp() {
    exec("del /q/f/s %temp%\\*")
}

function NotepadPlusPlus() {
    exec('"C:\\Program Files\\Notepad++\\notepad++.exe"')
}

function ProgramFilesPath() {
  shell.openPath('C:\\Program Files')
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name of Object.keys(interfaces)) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
}

function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.ip);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

function getFormattedDateTime() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = now.toTimeString().slice(0, 8); // HH:MM:SS
  return `${date} ${time}`;
}

function TaskManager() {
    exec('taskmgr');
}

function ControlPanel() {
    exec('control');
}

function GetLanguage() {
  return app.getLocale();
}

module.exports = { GetLanguage, OpennerApp, CleanerTrash, CleanerTemp, NotepadPlusPlus, getLocalIP, getPublicIP, getFormattedDateTime, TaskManager, ControlPanel, ProgramFilesPath };