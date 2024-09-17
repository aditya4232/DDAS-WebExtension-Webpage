const MAX_DOWNLOADS = 3; // Number of downloads to trigger popup
let downloadCount = {}; // Object to keep track of download names and counts

// Function to update download counts and handle notifications/popup
function updateDownloadCounts(filename) {
  if (!downloadCount[filename]) {
    downloadCount[filename] = 1;
  } else {
    downloadCount[filename]++;
  }

  // Trigger notification and popup if the count exceeds the threshold
  if (downloadCount[filename] >= MAX_DOWNLOADS) {
    chrome.storage.local.set({ downloadCount }, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon.png',
        title: 'Multiple Downloads Detected',
        message: `Multiple downloads with the same name detected: ${filename}`,
        priority: 2
      });

      // Open the popup automatically
      chrome.action.openPopup();
    });
  }
}

// Listener for new downloads
chrome.downloads.onCreated.addListener((downloadItem) => {
  updateDownloadCounts(downloadItem.filename);
});

// Clear counts on extension installation/reload
chrome.runtime.onInstalled.addListener(() => {
  downloadCount = {};
});
