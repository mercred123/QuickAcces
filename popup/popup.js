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
  btn_ProgramFiles: "ProgramFilesPath",
};

const confirmButtons = {
  btn_Dustbin: {
    title: "Vider la corbeille",
    message: "Voulez-vous vraiment vider la corbeille ?",
    afterAction: refreshTrashCount
  },
  btn_TrashTemp: {
    title: "Nettoyer %temp%",
    message: "Voulez-vous vraiment vider %temp% ?",
    afterAction: null
  }
};

for (const [btnId, actionName] of Object.entries(buttons)) {
  document.getElementById(btnId).addEventListener("click", () => {
    if (confirmButtons[btnId]) {
      const { title, message, afterAction } = confirmButtons[btnId];
      showFloatingPopup(title, message, async () => {
        await window.electronAPI[actionName]();
        if (afterAction) await afterAction();
      });
    } else {
      window.electronAPI[actionName]();
    }
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

function showFloatingPopup(title, message, onConfirm) {
  document.getElementById("floatingPopupTitle").textContent = title;
  document.getElementById("floatingPopupMessage").textContent = message;
  document.getElementById("floatingPopup").style.display = "flex";

  const okBtn = document.getElementById("floatingPopupOk");
  const cancelBtn = document.getElementById("floatingPopupCancel");

  // Supprimer les anciens events
  okBtn.replaceWith(okBtn.cloneNode(true));
  cancelBtn.replaceWith(cancelBtn.cloneNode(true));

  // Récupérer les nouveaux
  const newOkBtn = document.getElementById("floatingPopupOk");
  const newCancelBtn = document.getElementById("floatingPopupCancel");

  newOkBtn.addEventListener("click", () => {
    hideFloatingPopup();
    if (typeof onConfirm === "function") onConfirm();
  });

  newCancelBtn.addEventListener("click", hideFloatingPopup);
}

function hideFloatingPopup() {
  document.getElementById("floatingPopup").style.display = "none";
}