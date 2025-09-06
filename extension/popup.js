document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const statusDiv = document.getElementById('status');

  analyzeBtn.addEventListener('click', () => {
    analyzeBtn.disabled = true;
    statusDiv.textContent = 'Analyzing...';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        // We need to inject both the content script and the stylesheet
        chrome.scripting.insertCSS({
          target: { tabId: activeTab.id },
          files: ['styles.css']
        });

        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(activeTab.id, { action: "analyzePage" }, (response) => {
            if (chrome.runtime.lastError) {
              statusDiv.textContent = 'Error: Could not connect. Reload page.';
              console.error(chrome.runtime.lastError.message);
            } else if (response && response.status === "complete") {
              statusDiv.textContent = 'Analysis complete!';
            } else {
              statusDiv.textContent = 'Analysis failed. Check server.';
            }
            // Close popup after showing the message
            setTimeout(() => window.close(), 1500);
          });
        });
      } else {
        statusDiv.textContent = 'Could not find an active tab.';
        analyzeBtn.disabled = false;
      }
    });
  });
});