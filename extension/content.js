(function() {
    if (window.hasRunCredo2) {
        return;
    }
    window.hasRunCredo2 = true;

    const backendUrl = 'http://localhost:3000/analyze';

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "analyzePage") {
            const pageText = document.body.innerText;
            showLoadingModal();

            fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: pageText.substring(0, 20000) }) // Send up to 20k chars
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                updateModalWithResults(data);
                sendResponse({ status: "complete" });
            })
            .catch(error => {
                console.error("Credo: Error fetching from backend:", error);
                updateModalWithError(error.message);
                sendResponse({ status: "error", message: error.message });
            });

            return true; // Indicates an asynchronous response.
        }
    });

    function showLoadingModal() {
        // Remove any existing modal
        const existingModal = document.getElementById('credo-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'credo-modal';
        modal.innerHTML = `
            <div class="credo-modal-content">
                <div class="credo-modal-header">
                    <h2>Analyzing Article...</h2>
                    <button id="credo-close-btn">&times;</button>
                </div>
                <div class="credo-modal-body">
                    <div class="credo-loader"></div>
                    <p>Please wait while Credo reads and analyzes the page content.</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('credo-close-btn').onclick = () => modal.remove();
    }

    function updateModalWithResults(data) {
        const modalContent = document.querySelector('#credo-modal .credo-modal-content');
        if (!modalContent) return;

        const score = data.credibilityScore || 0;
        const scoreColor = score > 7 ? '#27ae60' : score > 4 ? '#f39c12' : '#e74c3c';

        modalContent.innerHTML = `
            <div class="credo-modal-header">
                <h2>Credibility Report</h2>
                <button id="credo-close-btn">&times;</button>
            </div>
            <div class="credo-modal-body">
                <div class="credo-section">
                    <h3>Summary</h3>
                    <p>${data.summary || 'No summary available.'}</p>
                </div>
                <div class="credo-section">
                    <h3>Credibility Analysis</h3>
                    <div class="credo-score-container">
                        <div class="credo-score-circle" style="border-color: ${scoreColor};">
                            <span>${score}</span>/10
                        </div>
                        <div class="credo-score-text">
                             <p>${data.justification || 'No justification available.'}</p>
                        </div>
                    </div>
                </div>
                <div class="credo-section">
                     <h3>Potential Flags</h3>
                     <ul class="credo-flags-list">
                        ${(data.flags && data.flags.length > 0)
                            ? data.flags.map(flag => `<li>${flag}</li>`).join('')
                            : '<li>No specific flags identified.</li>'
                        }
                     </ul>
                </div>
            </div>
        `;
        document.getElementById('credo-close-btn').onclick = () => {
            document.getElementById('credo-modal').remove();
        };
    }

    function updateModalWithError(errorMessage) {
        const modalContent = document.querySelector('#credo-modal .credo-modal-content');
        if (!modalContent) return;
        modalContent.innerHTML = `
             <div class="credo-modal-header">
                <h2>Analysis Failed</h2>
                <button id="credo-close-btn">&times;</button>
            </div>
            <div class="credo-modal-body">
                <p>Could not analyze the page. Please check the console for details.</p>
                <p><strong>Error:</strong> ${errorMessage}</p>
            </div>
        `;
        document.getElementById('credo-close-btn').onclick = () => {
            document.getElementById('credo-modal').remove();
        };
    }
})();