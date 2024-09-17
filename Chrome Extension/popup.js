document.getElementById('checkDuplication').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: detectDuplication
    });
  });
});

document.getElementById('clearBadge').addEventListener('click', () => {
  chrome.action.setBadgeText({ text: "" });
});

document.getElementById('openSettings').addEventListener('click', () => {
  alert("Settings are not available yet.");
});

document.getElementById('allowDownloads').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "allowDownloads" });
  document.getElementById('confirmationSection').style.display = 'none';
});

document.getElementById('cancelDownloads').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "cancelDownloads" });
  document.getElementById('confirmationSection').style.display = 'none';
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "showConfirmation") {
    document.getElementById('confirmationMessage').textContent = `Multiple ${message.fileType} files are being downloaded. Do you want to allow them?`;
    document.getElementById('confirmationSection').style.display = 'block';
  }
});
