let pendingDownloads = {};
let downloadThreshold = 2; // Number of downloads to trigger the alert

chrome.downloads.onCreated.addListener((downloadItem) => {
  let fileType = getFileType(downloadItem.filename);

  if (!pendingDownloads[fileType]) {
    pendingDownloads[fileType] = [];
  }
  
  pendingDownloads[fileType].push(downloadItem.id);

  if (pendingDownloads[fileType].length >= downloadThreshold) {
    // Cancel the download and prompt user for confirmation
    chrome.downloads.cancel(downloadItem.id, () => {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/logo.jpg",
        title: "Download Alert",
        message: `Multiple ${fileType} files are being downloaded. Do you want to allow them?`,
        actions: [
          { title: "Allow Downloads", action: "allow" },
          { title: "Cancel Downloads", action: "cancel" }
        ],
        priority: 2
      });
    });
  }
});

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === "complete") {
    let fileType = getFileType(delta.filename);
    if (pendingDownloads[fileType]) {
      pendingDownloads[fileType] = pendingDownloads[fileType].filter(id => id !== delta.id);
    }
  }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // Allow Downloads
    chrome.runtime.sendMessage({ type: "allowDownloads" });
  } else if (buttonIndex === 1) { // Cancel Downloads
    chrome.runtime.sendMessage({ type: "cancelDownloads" });
  }
});

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
    return 'image';
  }
  // Add more categories as needed
  return 'other';
}
