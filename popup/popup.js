const buttons = {
  btn_Dustbin: "CleanerTrash",
  btn_TrashTemp: "CleanerTemp",
  btn_NotepadPlusPlus: "NotepadPlusPlus",
  btn_Paint: "OpennerPaint",
  btn_Calc: "OpennerCalc",
  btn_ChatGPT: "OpenChatGPT",
  btn_AppData: "OpenAppData",
  btn_IpPrivate: "copyIP",
  btn_IpPublic: "copyPublicIP",
  btn_DateTime: "getFormattedDateTime",
  btn_TaskManager: "TaskManager",
  btn_ControlPanel: "ControlPanel",
};

for (const [btnId, actionName] of Object.entries(buttons)) {
  document.getElementById(btnId).addEventListener("click", () => {
    window.electronAPI[actionName]();
  });
}

document.getElementById("btn_Settings").addEventListener("click", () => {
  window.location.href = "settings.html";
});

window.addEventListener("DOMContentLoaded", async () => {
  const settings = await window.settingsAPI.getSettings();
  const isLight = settings["lightMode"] || false;
  applyTheme(isLight);
});

function applyTheme(isLight) {
  if (isLight) {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  } else {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  }
}

async function refreshTrashCount() {
  const badge = document.getElementById("trashCount");
  const count = await window.electronAPI.getTrashCount();

  badge.textContent = count;
  badge.style.display = "inline";
}

window.electronAPI.onFocusChange((isFocused) => {
  if (isFocused) {
    refreshTrashCount();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const buttons = Array.from(document.querySelectorAll(".button"));

  searchBar.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    buttons.forEach(btn => {
      const match = btn.innerText.toLowerCase().includes(query);
      btn.style.display = match ? "block" : "none";
    });
  });
});
