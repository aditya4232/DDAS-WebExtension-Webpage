let downloadCount = 0;
const threshold = 2;  // Number of downloads to trigger the popup

chrome.downloads.onCreated.addListener((downloadItem) => {
    downloadCount++;
    
    if (downloadCount >= threshold) {
        // Open the popup when multiple downloads are detected
        chrome.action.openPopup();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'resetCount') {
        downloadCount = 0;  // Reset the download count after confirmation
    }
});
