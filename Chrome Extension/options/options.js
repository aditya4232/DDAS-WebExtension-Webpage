document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const threshold = document.getElementById('threshold').value;
  
    chrome.storage.sync.set({ threshold: threshold }, () => {
      alert('Settings saved!');
    });
  });
  
  // Load the stored settings
  chrome.storage.sync.get(['threshold'], function(result) {
    document.getElementById('threshold').value = result.threshold || 1;
  });
  