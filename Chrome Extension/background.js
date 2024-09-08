chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    chrome.storage.sync.get(['userId'], function(result) {
      const userId = result.userId || 'anonymous';
      fetch('http://localhost:3000/api/log-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: downloadItem.filename,
          userId: userId,
          timestamp: Date.now()
        })
      }).catch(error => console.error('Error logging download:', error));
    });
  });