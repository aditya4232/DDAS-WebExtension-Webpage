document.getElementById('loginBtn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log('Token:', token);
    chrome.storage.sync.set({ userToken: token });
  });
});
