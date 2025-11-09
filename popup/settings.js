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

  await applyTranslations();
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

document.getElementById("btn_Statistic").addEventListener("click", () => {
  window.location.href = "statistic.html";
});

document.getElementById("select_Langue").addEventListener("change", async (event) => {
  const selectedLang = event.target.value;
  await window.electronAPI.setLanguage(selectedLang);
  await applyTranslations();
})

async function applyTranslations() {
  const lang = await window.electronAPI.Language();
  const shortLang = lang.slice(0, 2).toLowerCase();
  const jsonPath =
    shortLang === "fr" ? "./languages/FR.json" : "./languages/US.json";
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error("JSON introuvable : " + jsonPath);
  const texts = await res.json();
  try {
    Object.keys(texts).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (el.tagName === "INPUT") {
        el.placeholder = texts[id];
      } else {
        el.textContent = texts[id];
      }
    });
  } catch (err) {
    console.error("Erreur chargement traduction :", err);
  }
}

document.addEventListener("DOMContentLoaded", () => applyTranslations());