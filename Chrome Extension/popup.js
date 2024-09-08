document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const userInfo = document.getElementById('userInfo');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const userDisplay = document.getElementById('userDisplay');

  chrome.storage.sync.get(['userId', 'username'], function(result) {
    if (result.userId && result.username) {
      showUserInfo(result.username);
    }
  });

  loginBtn.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.userId) {
        chrome.storage.sync.set({ userId: data.userId, username: username }, function() {
          showUserInfo(username);
        });
      } else {
        alert('Login failed');
      }
    })
    .catch(error => console.error('Error:', error));
  });

  logoutBtn.addEventListener('click', function() {
    chrome.storage.sync.remove(['userId', 'username'], function() {
      showLoginForm();
    });
  });

  settingsBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'http://localhost:3000/settings.html' });
  });

  function showUserInfo(username) {
    loginForm.classList.add('hidden');
    userInfo.classList.remove('hidden');
    userDisplay.textContent = username;
  }

  function showLoginForm() {
    loginForm.classList.remove('hidden');
    userInfo.classList.add('hidden');
  }
});