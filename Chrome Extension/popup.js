document.getElementById('allow').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'resetCount' });
  window.close();  // Close the popup
});

document.getElementById('deny').addEventListener('click', () => {
  // Simply close the popup and do nothing
  window.close();
});
