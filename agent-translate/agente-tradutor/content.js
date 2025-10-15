document.addEventListener("mouseup", () => {
  const selected = window.getSelection().toString().trim();
  if (selected) {
    chrome.storage.local.set({ selectedText: selected });
  }
});
