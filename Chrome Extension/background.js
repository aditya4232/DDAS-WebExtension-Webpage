let downloadedFiles = {};
let alertThreshold = 1; // Default value

// Listening for messages from the webpage to update the settings
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateSettings') {
    alertThreshold = message.threshold;
    sendResponse({status: 'Settings updated!'});
  }
});

// Download listener
chrome.downloads.onCreated.addListener((downloadItem) => {
  const fileName = downloadItem.filename;

  // Check for duplicate downloads based on the threshold
  if (downloadedFiles[fileName]) {
    downloadedFiles[fileName] += 1;
    if (downloadedFiles[fileName] >= alertThreshold) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Duplicate Download Detected",
        message: `The file "${fileName}" has already been downloaded ${downloadedFiles[fileName]} times.`
      });
    }
  } else {
    downloadedFiles[fileName] = 1;
  }
});

// Reset downloads list on browser restart or extension reload
chrome.runtime.onStartup.addListener(() => {
  downloadedFiles = {};
});
