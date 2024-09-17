function detectDuplication() {
    const textElements = document.body.innerText.split(/\s+/);
    const wordCounts = {};
    
    textElements.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  
    const duplicatedWords = Object.keys(wordCounts).filter(key => wordCounts[key] > 5);
  
    if (duplicatedWords.length > 0) {
      chrome.runtime.sendMessage({ type: "duplicationDetected" }, (response) => {
        console.log(response.status);
      });
    }
  }
  
  window.onload = detectDuplication;
  