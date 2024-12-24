chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchGeminiResponse") {
        fetch("http://localhost:5000/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: message.query })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse(data);
        })
        .catch(error => {
            sendResponse({ error: error.toString() });
        });
        return true; // Keep the message channel open for async response
    }
});
