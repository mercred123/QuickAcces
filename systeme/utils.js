const { exec } = require("child_process");

function OpennerApp(app) {
    exec(`${app}`)
}

function CleanerTrash() {
    exec('PowerShell.exe -Command "Clear-RecycleBin -Force"')
}

function CleanerTemp() {
    exec("del /q/f/s %temp%\\*")
}

function NotepadPlusPlus() {
    exec('"C:\\Program Files\\Notepad++\\notepad++.exe"')
}

module.exports = { OpennerApp, CleanerTrash, CleanerTemp, NotepadPlusPlus };