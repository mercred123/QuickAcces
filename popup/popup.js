const buttons = {
  btn_Dustbin: "CleanerTrash",
  btn_TrashTemp: "CleanerTemp",
  btn_NotepadPlusPlus: "NotepadPlusPlus",
  btn_Paint: "OpennerPaint",
  btn_Calc: "OpennerCalc",
  btn_ChatGPT: "OpenChatGPT",
  btn_AppData: "OpenAppData",
};

for (const [btnId, actionName] of Object.entries(buttons)) {
  document.getElementById(btnId).addEventListener("click", () => {
    window.electronAPI[actionName]();
  });
}

document.getElementById("btn_Settings").addEventListener("click", () => {
  window.location.href = "settings.html";
});

window.addEventListener('DOMContentLoaded', async () => {
  const settings = await window.settingsAPI.getSettings();
  const isLight = settings["lightMode"] || false;
  applyTheme(isLight);
});

function applyTheme(isLight) {
  if (isLight) {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
}