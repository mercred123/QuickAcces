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