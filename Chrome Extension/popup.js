document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get('duplicationStatus', function (data) {
    if (data.duplicationStatus === 'detected') {
      document.getElementById('duplicate-alert').classList.remove('hidden');
      document.getElementById('details').textContent = data.details;
    }
  });

  document.getElementById('view-reports').addEventListener('click', function () {
    chrome.tabs.create({ url: 'reports.html' });
  });
});
