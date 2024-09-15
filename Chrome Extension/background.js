chrome.downloads.onCreated.addListener((downloadItem) => {
  const fileName = downloadItem.filename;
  const userDetails = 'user-session-data'; // Can be extended with real user data
  const downloadHash = fileName + userDetails;

  chrome.storage.sync.get(['downloads'], function (data) {
    const downloads = data.downloads || [];

    const isDuplicate = downloads.some(
      (download) => download.hash === downloadHash
    );

    if (isDuplicate) {
      // Alert and log the duplicate attempt
      chrome.storage.sync.set({
        duplicationStatus: 'detected',
        details: `File: ${fileName} has been downloaded again.`
      });

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Duplicate Download Detected',
        message: `The file "${fileName}" has been downloaded again.`
      });
    } else {
      // Save the new download record
      downloads.push({ hash: downloadHash, fileName });
      chrome.storage.sync.set({ downloads });
    }
  });
});
