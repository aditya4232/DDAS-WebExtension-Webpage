document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('downloadCount', (data) => {
      let downloadCount = data.downloadCount || {};
      let downloadList = document.getElementById('download-list');
  
      for (let filename in downloadCount) {
        if (downloadCount[filename] > 1) {
          downloadList.innerHTML += `<p>${filename}: ${downloadCount[filename]} downloads</p>`;
        }
      }
  
      if (Object.keys(downloadCount).length === 0) {
        downloadList.innerHTML = '<p>No downloads detected.</p>';
      }
    });
  
    document.getElementById('ok').addEventListener('click', () => {
      chrome.storage.local.set({ downloadCount: {} }); // Clear the count after user acknowledgment
      window.close();
    });
  });
  