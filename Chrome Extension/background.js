let downloadedFiles = {};

chrome.downloads.onCreated.addListener((downloadItem) => {
  const fileName = downloadItem.filename;

  if (downloadedFiles[fileName]) {
    // Duplicate detected
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Duplicate Download Detected",
      message: `The file "${fileName}" has already been downloaded.`
    });
  } else {
    downloadedFiles[fileName] = true;
  }
});

// Reset on browser restart or extension reload
chrome.runtime.onStartup.addListener(() => {
  downloadedFiles = {};
});
