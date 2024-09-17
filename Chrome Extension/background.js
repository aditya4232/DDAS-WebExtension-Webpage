// Initialize storage for tracking downloads when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ downloadedFiles: [] });
});

// Listen for download events
chrome.downloads.onCreated.addListener((downloadItem) => {
  // Before proceeding, check if we have the 'downloads' permission
  chrome.permissions.contains({
      permissions: ['downloads']
  }, (hasPermission) => {
      if (!hasPermission) {
          // If we don't have the permission, request it dynamically
          chrome.permissions.request({
              permissions: ['downloads']
          }, (granted) => {
              if (granted) {
                  console.log('Downloads permission granted.');
                  handleDownload(downloadItem);  // Call function to handle the download
              } else {
                  console.log('Downloads permission denied.');
              }
          });
      } else {
          // If permission is already granted, proceed with the download handling
          handleDownload(downloadItem);
      }
  });
});

// Function to handle the download logic (check for duplicates)
function handleDownload(downloadItem) {
  const fileName = downloadItem.filename;

  // Retrieve the list of previously downloaded files from storage
  chrome.storage.local.get("downloadedFiles", (data) => {
      const downloadedFiles = data.downloadedFiles || [];

      // Check if a file with the same name already exists
      const isDuplicate = downloadedFiles.some(file => file.name === fileName);

      if (isDuplicate) {
          // Show a notification to the user about the duplicate
          chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icon.png',
              title: 'Duplicate File Detected',
              message: `The file "${fileName}" has already been downloaded. Do you want to locate it or download again?`,
              buttons: [
                  { title: "Locate File" },
                  { title: "Download Again" }
              ],
              priority: 2
          });

          // Handle user response to the notification
          chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
              if (notifId === downloadItem.id) {
                  if (btnIdx === 0) {
                      // Locate the file
                      locateFile(fileName);
                  } else if (btnIdx === 1) {
                      // Allow the file to be downloaded again
                  }
              }
          });
      } else {
          // If no duplicate, save the file info and allow the download
          downloadedFiles.push({ name: fileName });
          chrome.storage.local.set({ downloadedFiles });
      }
  });
}

// Function to locate an existing file
function locateFile(fileName) {
  chrome.downloads.search({ filename: fileName }, (results) => {
      if (results.length > 0) {
          chrome.downloads.show(results[0].id);  // Show the existing file in the Downloads folder
      }
  });
}
