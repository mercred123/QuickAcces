document.getElementById("btn_Back").addEventListener("click", () => {
  window.location.href = "popup.html";
});

window.addEventListener("DOMContentLoaded", async () => {
  const versionSpan = document.getElementById("app-version");
  const version = await window.settingsAPI.getAppVersion();
  versionSpan.textContent = version;

  const toggle = document.getElementById("toggle-theme");
  const settings = await window.settingsAPI.getSettings();

  toggle.checked = settings["lightMode"] || false;

  applyTheme(toggle.checked);

  toggle.addEventListener("change", async () => {
    const isLight = toggle.checked;
    await window.settingsAPI.setSetting("lightMode", isLight);
    applyTheme(isLight);
  });
});

function applyTheme(isLight) {
  console.log('applyTheme called with:', isLight);
  if (isLight) {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
}

document.getElementById("btn_Statistic").addEventListener("click", () => {
  window.location.href = "statistic.html";
});