chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('Download started:', downloadItem);

  chrome.storage.sync.get('userToken', (data) => {
    const token = data.userToken;
    if (token) {
      fetch('http://localhost:3000/api/detect-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: downloadItem.filename,
          url: downloadItem.url
        })
      });
    }
  });
});
