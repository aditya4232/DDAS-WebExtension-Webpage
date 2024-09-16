document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['downloadHistory'], function(result) {
    const history = result.downloadHistory || [];
    const historyDiv = document.getElementById('history');

    if (history.length === 0) {
      historyDiv.textContent = 'No downloads yet.';
    } else {
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'download-item';
        div.textContent = `File: ${item.filename} | Time: ${new Date(item.timestamp).toLocaleString()}`;
        historyDiv.appendChild(div);
      });
    }
  });
});
