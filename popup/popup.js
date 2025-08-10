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
