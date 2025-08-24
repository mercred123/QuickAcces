document.getElementById("btn_Back").addEventListener("click", () => {
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
;
window.addEventListener("DOMContentLoaded", async () => {
  const stats = await window.electronAPI.getStats();
  document.getElementById("countButtons").textContent = stats.buttonsClicked;
});