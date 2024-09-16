let downloadHistory = [];

chrome.downloads.onCreated.addListener((downloadItem) => {
  chrome.storage.sync.get(["downloadHistory"], (result) => {
    downloadHistory = result.downloadHistory || [];

    const fileHash = downloadItem.url + downloadItem.filename;
    const duplicate = downloadHistory.find(item => item.hash === fileHash);

    if (duplicate) {
      // Send notification of duplicate download
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Duplicate Download Detected',
        message: `File ${downloadItem.filename} was already downloaded!`,
        priority: 2
      });
    } else {
      // Add new file to download history
      downloadHistory.push({
        id: downloadItem.id,
        filename: downloadItem.filename,
        url: downloadItem.url,
        hash: fileHash,
        timestamp: Date.now()
      });

      chrome.storage.sync.set({ "downloadHistory": downloadHistory });
    }
  });
});
